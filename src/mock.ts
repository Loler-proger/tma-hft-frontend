import { mockTelegramEnv, emitEvent } from '@telegram-apps/bridge';

const noInsets = {
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
} as const;
const themeParams = {
  accent_text_color: '#6ab2f2',
  bg_color: '#17212b',
  button_color: '#5288c1',
  button_text_color: '#ffffff',
  destructive_text_color: '#ec3942',
  header_bg_color: '#17212b',
  hint_color: '#708499',
  link_color: '#6ab3f3',
  secondary_bg_color: '#232e3c',
  section_bg_color: '#17212b',
  section_header_text_color: '#6ab3f3',
  subtitle_text_color: '#708499',
  text_color: '#f5f5f5',
} as const;

mockTelegramEnv({
  launchParams: {
    tgWebAppThemeParams: themeParams,
    tgWebAppData: new URLSearchParams([
      ['user', JSON.stringify({
        id: 1,
        first_name: 'Pavel',
        username: 'kat0FalK',
        photo_url: 'https://sun6-21.userapi.com/s/v1/ig2/RLmvw0Cq27MVjGf8t08-wtpXiQNCbN2VcerxzdkCACeANIAbVqY_NfcHj4BoYNM3Ln3FeQx_dnToTsuAA7o9ibGB.jpg?quality=95&crop=0,7,957,957&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&u=eFwoLK9wEEebPI0wSXnMTmxjNx0O5mMwUq29Gc3vW24&cs=50x50'
      })],
      ['hash', ''],
      ['signature', ''],
      ['auth_date', Date.now().toString()],
    ]),
    tgWebAppStartParam: 'debug',
    tgWebAppVersion: '8',
    tgWebAppPlatform: 'tdesktop',
  },
  onEvent(e) {
    if (e[0] === 'web_app_request_theme') {
      return emitEvent('theme_changed', { theme_params: themeParams });
    }
    if (e[0] === 'web_app_request_viewport') {
      return emitEvent('viewport_changed', {
        height: window.innerHeight,
        width: window.innerWidth,
        is_expanded: true,
        is_state_stable: true,
      });
    }
    if (e[0] === 'web_app_request_content_safe_area') {
      return emitEvent('content_safe_area_changed', noInsets);
    }
    if (e[0] === 'web_app_request_safe_area') {
      return emitEvent('safe_area_changed', noInsets);
    }
  },
});