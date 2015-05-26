#include <pebble.h>

static Window *window;
static TextLayer *text_layer;

enum {
  KEY_SEND_USER = 0x0,
};

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

static void send_user() {
//   APP_LOG(APP_LOG_LEVEL_DEBUG, "Sending a user");
  DictionaryIterator *iter;

  /*
  if (iter == NULL) {
    APP_LOG(APP_LOG_LEVEL_DEBUG, "null iter");
    return;
  }
  */
  
  app_message_outbox_begin(&iter);
  
  int key = 78;
  int value = 2113;
  dict_write_int(iter, key, &value, sizeof(int), true);
  
  dict_write_end(iter);
  app_message_outbox_send();
}

static void select_single_click_handler(ClickRecognizerRef recognizer, void *context) {
  send_user();
}

static void config_provider(void *context) {
  // single click / repeat-on-hold config:
  window_single_click_subscribe(BUTTON_ID_SELECT, select_single_click_handler);
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
  
  app_message_open(256, 256);
}

static void deinit(void) {
  window_destroy(window);
}

int main(void) {
  init();
  window_set_click_config_provider(window, (ClickConfigProvider) config_provider);
  app_event_loop();
  deinit();
}
