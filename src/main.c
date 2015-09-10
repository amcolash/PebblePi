#include <pebble.h>

#define KEY_REBOOT 0
#define KEY_ERROR 1
  
static Window *window;
static TextLayer *text_layer;

static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);

  text_layer = text_layer_create(GRect(2, 32, 140, 120));
  text_layer_set_text(text_layer, "Set up notifications via the settings page!");
  text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
  text_layer_set_background_color(text_layer, GColorClear);
  
  #ifdef PBL_COLOR
	  text_layer_set_text_color(text_layer, GColorDarkGreen);
	#else
		text_layer_set_text_color(text_layer, GColorWhite);	
	#endif
  
  text_layer_set_font(text_layer, fonts_get_system_font(FONT_KEY_GOTHIC_24_BOLD));
  layer_add_child(window_layer, text_layer_get_layer(text_layer));
}

static void reboot_pi() {
  text_layer_set_text(text_layer, "Rebooting Pi...");
  
  DictionaryIterator *iter;

  if (iter == NULL) {
    APP_LOG(APP_LOG_LEVEL_DEBUG, "null iter");
    return;
  }
  
  app_message_outbox_begin(&iter);
  
  int key = KEY_REBOOT;
  int value = 0;
  dict_write_int(iter, key, &value, sizeof(int), true);
  
  dict_write_end(iter);
  app_message_outbox_send();
}

static void inbox_received_callback(DictionaryIterator *iterator, void *context) {
  APP_LOG(APP_LOG_LEVEL_INFO, "Message received!");
  
  // Get the first pair
  Tuple *t = dict_read_first(iterator);

  // Process all pairs present
  while (t != NULL) {
    // Long lived buffer
    static char s_buffer[64];

    // Process this pair's key
    switch (t->key) {
      case KEY_ERROR:
        if (t->value->int32 == 0) {
          text_layer_set_text(text_layer, "Successfully rebooted");
          window_stack_pop_all(true);
        } else {
          text_layer_set_text(text_layer, "Something went wrong...");
        }
        break;
    }

    // Get next pair, if any
    t = dict_read_next(iterator);
  }
}

static void inbox_dropped_callback(AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Message dropped!");
}

static void outbox_failed_callback(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Outbox send failed!");
}

static void outbox_sent_callback(DictionaryIterator *iterator, void *context) {
  APP_LOG(APP_LOG_LEVEL_INFO, "Outbox send success!");
}

static void window_unload(Window *window) {
  text_layer_destroy(text_layer);
}

static void init(void) {
  window = window_create();
  
  #ifdef PBL_COLOR
	  window_set_background_color(window, GColorGreen);
	#else
		text_layer_set_text_color(text_layer, GColorBlack);	
	#endif
  
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
  
  window_stack_push(window, false);
  
  // Register callbacks
  app_message_register_inbox_received(inbox_received_callback);
  app_message_register_inbox_dropped(inbox_dropped_callback);
  app_message_register_outbox_failed(outbox_failed_callback);
  app_message_register_outbox_sent(outbox_sent_callback);
  
  app_message_open(256, 256);
  
  if (launch_reason() == APP_LAUNCH_TIMELINE_ACTION) {
    uint32_t arg = launch_get_args();
    switch(arg) {
      case 1:
        reboot_pi();
        break;
    }
  }
}

static void deinit(void) {
  window_destroy(window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}