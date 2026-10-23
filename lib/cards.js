// Shared helpers for the card suite (stats / streak / languages / trophy).
// Theme catalog: the full github-readme-stats theme list (from its public
// themes/index.js) mapped onto this project's theme fields
// { bg, border, title, line, point, grid, text }, plus this project's five
// original themes kept with their exact original values, plus extra
// well-known palettes. Underscore and hyphen spellings both resolve.

const THEMES = {
  "algolia": {"bg":"#050f2c","border":"#2dde98","title":"#00aeff","line":"#2dde98","point":"#2dde98","grid":"#2dde98","text":"#ffffff"},
  "ambient-gradient": {"bg":"#4158d0","border":"#ffffff","title":"#ffffff","line":"#ffffff","point":"#ffffff","grid":"#ffffff","text":"#ffffff","bgGradient":{"angle":35,"colors":["#4158d0","#c850c0","#ffcc70"]}},
  "ambient_gradient": {"bg":"#4158d0","border":"#ffffff","title":"#ffffff","line":"#ffffff","point":"#ffffff","grid":"#ffffff","text":"#ffffff","bgGradient":{"angle":35,"colors":["#4158d0","#c850c0","#ffcc70"]}},
  "apprentice": {"bg":"#262626","border":"#ffffaf","title":"#ffffff","line":"#ffffaf","point":"#ffffaf","grid":"#ffffaf","text":"#bcbcbc"},
  "aura": {"bg":"#15141b","border":"#ffca85","title":"#a277ff","line":"#ffca85","point":"#ffca85","grid":"#ffca85","text":"#61ffca"},
  "aura-dark": {"bg":"#252334","border":"#6cffd0","title":"#ff7372","line":"#6cffd0","point":"#6cffd0","grid":"#6cffd0","text":"#dbdbdb"},
  "aura_dark": {"bg":"#252334","border":"#6cffd0","title":"#ff7372","line":"#6cffd0","point":"#6cffd0","grid":"#6cffd0","text":"#dbdbdb"},
  "ayu-dark": {"bg":"#0b0e14","border":"#1c212b","title":"#39bae6","line":"#39bae6","point":"#ffb454","grid":"#171b24","text":"#bfbdb6"},
  "ayu-light": {"bg":"#fafafa","border":"#e7e8e9","title":"#399ee6","line":"#399ee6","point":"#ff9940","grid":"#e7e8e9","text":"#5c6166"},
  "ayu-mirage": {"bg":"#1f2430","border":"#73d0ff","title":"#f4cd7c","line":"#73d0ff","point":"#73d0ff","grid":"#73d0ff","text":"#c7c8c2"},
  "ayu_dark": {"bg":"#0b0e14","border":"#1c212b","title":"#39bae6","line":"#39bae6","point":"#ffb454","grid":"#171b24","text":"#bfbdb6"},
  "ayu_light": {"bg":"#fafafa","border":"#e7e8e9","title":"#399ee6","line":"#399ee6","point":"#ff9940","grid":"#e7e8e9","text":"#5c6166"},
  "ayu_mirage": {"bg":"#1f2430","border":"#73d0ff","title":"#f4cd7c","line":"#73d0ff","point":"#73d0ff","grid":"#73d0ff","text":"#c7c8c2"},
  "bear": {"bg":"#1f2023","border":"#00aeff","title":"#e03c8a","line":"#00aeff","point":"#00aeff","grid":"#00aeff","text":"#bcb28d"},
  "blue-green": {"bg":"#040f0f","border":"#f5b700","title":"#2f97c1","line":"#f5b700","point":"#f5b700","grid":"#f5b700","text":"#0cf574"},
  "blue-navy": {"bg":"#000000","border":"#ffffff","title":"#82aaff","line":"#82aaff","point":"#82aaff","grid":"#ffffff","text":"#82aaff"},
  "blue_green": {"bg":"#040f0f","border":"#f5b700","title":"#2f97c1","line":"#f5b700","point":"#f5b700","grid":"#f5b700","text":"#0cf574"},
  "blue_navy": {"bg":"#000000","border":"#ffffff","title":"#82aaff","line":"#82aaff","point":"#82aaff","grid":"#ffffff","text":"#82aaff"},
  "blueberry": {"bg":"#242938","border":"#89ddff","title":"#82aaff","line":"#89ddff","point":"#89ddff","grid":"#89ddff","text":"#27e8a7"},
  "buefy": {"bg":"#ffffff","border":"#ff3860","title":"#7957d5","line":"#ff3860","point":"#ff3860","grid":"#ff3860","text":"#363636"},
  "calm": {"bg":"#373f51","border":"#edae49","title":"#e07a5f","line":"#edae49","point":"#edae49","grid":"#edae49","text":"#ebcfb2"},
  "calm-pink": {"bg":"#2b2d40","border":"#e1bc29","title":"#e07a5f","line":"#ebcfb2","point":"#ebcfb2","grid":"#e1bc29","text":"#edae49"},
  "calm_pink": {"bg":"#2b2d40","border":"#e1bc29","title":"#e07a5f","line":"#ebcfb2","point":"#ebcfb2","grid":"#e1bc29","text":"#edae49"},
  "carbonfox": {"bg":"#161616","border":"#2a2a2a","title":"#78a9ff","line":"#78a9ff","point":"#ff7eb6","grid":"#333333","text":"#f2f4f8"},
  "catppuccin-frappe": {"bg":"#303446","border":"#414559","title":"#8caaee","line":"#8caaee","point":"#f4b8e4","grid":"#414559","text":"#c6d0f5"},
  "catppuccin-latte": {"bg":"#eff1f5","border":"#8839ef","title":"#137980","line":"#8839ef","point":"#8839ef","grid":"#8839ef","text":"#4c4f69"},
  "catppuccin-macchiato": {"bg":"#24273a","border":"#363a4f","title":"#8aadf4","line":"#8aadf4","point":"#f5bde6","grid":"#363a4f","text":"#cad3f5"},
  "catppuccin-mocha": {"bg":"#1e1e2e","border":"#cba6f7","title":"#94e2d5","line":"#cba6f7","point":"#cba6f7","grid":"#cba6f7","text":"#cdd6f4"},
  "catppuccin_frappe": {"bg":"#303446","border":"#414559","title":"#8caaee","line":"#8caaee","point":"#f4b8e4","grid":"#414559","text":"#c6d0f5"},
  "catppuccin_latte": {"bg":"#eff1f5","border":"#8839ef","title":"#137980","line":"#8839ef","point":"#8839ef","grid":"#8839ef","text":"#4c4f69"},
  "catppuccin_macchiato": {"bg":"#24273a","border":"#363a4f","title":"#8aadf4","line":"#8aadf4","point":"#f5bde6","grid":"#363a4f","text":"#cad3f5"},
  "catppuccin_mocha": {"bg":"#1e1e2e","border":"#cba6f7","title":"#94e2d5","line":"#cba6f7","point":"#cba6f7","grid":"#cba6f7","text":"#cdd6f4"},
  "chartreuse-dark": {"bg":"#000000","border":"#00aeff","title":"#7fff00","line":"#00aeff","point":"#00aeff","grid":"#00aeff","text":"#ffffff"},
  "chartreuse_dark": {"bg":"#000000","border":"#00aeff","title":"#7fff00","line":"#00aeff","point":"#00aeff","grid":"#00aeff","text":"#ffffff"},
  "city-lights": {"bg":"#1d252c","border":"#4798ff","title":"#5d8cb3","line":"#4798ff","point":"#4798ff","grid":"#4798ff","text":"#718ca1"},
  "city_lights": {"bg":"#1d252c","border":"#4798ff","title":"#5d8cb3","line":"#4798ff","point":"#4798ff","grid":"#4798ff","text":"#718ca1"},
  "cobalt": {"bg":"#193549","border":"#0480ef","title":"#e683d9","line":"#0480ef","point":"#0480ef","grid":"#0480ef","text":"#75eeb2"},
  "cobalt2": {"bg":"#193549","border":"#ffffff","title":"#ffc600","line":"#ffffff","point":"#ffffff","grid":"#ffffff","text":"#0088ff"},
  "codeSTACKr": {"bg":"#09131b","border":"#0c1a25","title":"#ff652f","line":"#ffe400","point":"#ffe400","grid":"#0c1a25","text":"#ffffff"},
  "darcula": {"bg":"#242424","border":"#84628f","title":"#ba5f17","line":"#84628f","point":"#84628f","grid":"#84628f","text":"#bebebe"},
  "dark": {"bg":"#151515","border":"#79ff97","title":"#ffffff","line":"#79ff97","point":"#79ff97","grid":"#79ff97","text":"#9f9f9f"},
  "date-night": {"bg":"#170f0c","border":"#170f0c","title":"#da7885","line":"#bb8470","point":"#bb8470","grid":"#170f0c","text":"#e1b2a2"},
  "date_night": {"bg":"#170f0c","border":"#170f0c","title":"#da7885","line":"#bb8470","point":"#bb8470","grid":"#170f0c","text":"#e1b2a2"},
  "default": {"bg":"#fffefe","border":"#e4e2e2","title":"#2f80ed","line":"#4c71f2","point":"#4c71f2","grid":"#e4e2e2","text":"#434d58"},
  "default-repocard": {"bg":"#fffefe","border":"#586069","title":"#2f80ed","line":"#586069","point":"#586069","grid":"#586069","text":"#434d58"},
  "default_repocard": {"bg":"#fffefe","border":"#586069","title":"#2f80ed","line":"#586069","point":"#586069","grid":"#586069","text":"#434d58"},
  "discord-old-blurple": {"bg":"#2c2f33","border":"#7289da","title":"#7289da","line":"#7289da","point":"#7289da","grid":"#7289da","text":"#ffffff"},
  "discord_old_blurple": {"bg":"#2c2f33","border":"#7289da","title":"#7289da","line":"#7289da","point":"#7289da","grid":"#7289da","text":"#ffffff"},
  "dracula": {"bg":"#282a36","border":"#79dafa","title":"#ff6e96","line":"#79dafa","point":"#79dafa","grid":"#79dafa","text":"#f8f8f2"},
  "duskfox": {"bg":"#232136","border":"#393552","title":"#9ccfd8","line":"#9ccfd8","point":"#eb6f92","grid":"#393552","text":"#e0def4"},
  "everforest": {"bg":"#2d353b","border":"#475258","title":"#a7c080","line":"#a7c080","point":"#dbbc7f","grid":"#3d484d","text":"#d3c6aa"},
  "everforest-light": {"bg":"#fdf6e3","border":"#e6e2cc","title":"#8da101","line":"#8da101","point":"#dfa000","grid":"#edeada","text":"#5c6a72"},
  "everforest_light": {"bg":"#fdf6e3","border":"#e6e2cc","title":"#8da101","line":"#8da101","point":"#dfa000","grid":"#edeada","text":"#5c6a72"},
  "flag-india": {"bg":"#ffffff","border":"#250e62","title":"#ff8f1c","line":"#250e62","point":"#250e62","grid":"#250e62","text":"#509e2f"},
  "flag_india": {"bg":"#ffffff","border":"#250e62","title":"#ff8f1c","line":"#250e62","point":"#250e62","grid":"#250e62","text":"#509e2f"},
  "flexoki": {"bg":"#100f0f","border":"#282726","title":"#4385be","line":"#4385be","point":"#d14d41","grid":"#1c1b1a","text":"#cecdc3"},
  "github": {"bg":"#ffffff","border":"#d0d7de","title":"#0969da","line":"#0969da","point":"#1f883d","grid":"#eaeef2","text":"#1f2328"},
  "github-dark": {"bg":"#0d1117","border":"#30363d","title":"#58a6ff","line":"#58a6ff","point":"#79c0ff","grid":"#21262d","text":"#8b949e"},
  "github-dark-dimmed": {"bg":"#24292f","border":"#373e47","title":"#539bf5","line":"#539bf5","point":"#539bf5","grid":"#373e47","text":"#adbac7"},
  "github-light": {"bg":"#ffffff","border":"#d0d7de","title":"#0969da","line":"#0969da","point":"#1f883d","grid":"#eaeef2","text":"#1f2328"},
  "github_dark": {"bg":"#0d1117","border":"#1f6feb","title":"#58a6ff","line":"#1f6feb","point":"#1f6feb","grid":"#1f6feb","text":"#c3d1d9"},
  "github_dark_dimmed": {"bg":"#24292f","border":"#373e47","title":"#539bf5","line":"#539bf5","point":"#539bf5","grid":"#373e47","text":"#adbac7"},
  "github_light": {"bg":"#ffffff","border":"#d0d7de","title":"#0969da","line":"#0969da","point":"#1f883d","grid":"#eaeef2","text":"#1f2328"},
  "gotham": {"bg":"#0c1014","border":"#599cab","title":"#2aa889","line":"#599cab","point":"#599cab","grid":"#599cab","text":"#99d1ce"},
  "graywhite": {"bg":"#ffffff","border":"#24292e","title":"#24292e","line":"#24292e","point":"#24292e","grid":"#24292e","text":"#24292e"},
  "great-gatsby": {"bg":"#000000","border":"#ffb74d","title":"#ffa726","line":"#ffb74d","point":"#ffb74d","grid":"#ffb74d","text":"#ffd95b"},
  "great_gatsby": {"bg":"#000000","border":"#ffb74d","title":"#ffa726","line":"#ffb74d","point":"#ffb74d","grid":"#ffb74d","text":"#ffd95b"},
  "gruvbox": {"bg":"#282828","border":"#fe8019","title":"#fabd2f","line":"#fe8019","point":"#fe8019","grid":"#fe8019","text":"#8ec07c"},
  "gruvbox-light": {"bg":"#fbf1c7","border":"#af3a03","title":"#b57614","line":"#af3a03","point":"#af3a03","grid":"#af3a03","text":"#427b58"},
  "gruvbox_light": {"bg":"#fbf1c7","border":"#af3a03","title":"#b57614","line":"#af3a03","point":"#af3a03","grid":"#af3a03","text":"#427b58"},
  "highcontrast": {"bg":"#000000","border":"#ffffff","title":"#e7f216","line":"#e7f216","point":"#ffffff","grid":"#3a3a3a","text":"#ffffff"},
  "holi": {"bg":"#030314","border":"#85a4c0","title":"#5fabee","line":"#5fabee","point":"#5fabee","grid":"#85a4c0","text":"#d6e7ff"},
  "horizon": {"bg":"#1c1e26","border":"#2e303e","title":"#e95678","line":"#e95678","point":"#fab795","grid":"#272a38","text":"#bbbbbb"},
  "jolly": {"bg":"#291b3e","border":"#a960ff","title":"#ff64da","line":"#a960ff","point":"#a960ff","grid":"#a960ff","text":"#ffffff"},
  "kacho-ga": {"bg":"#402b23","border":"#a64833","title":"#bf4a3f","line":"#a64833","point":"#a64833","grid":"#a64833","text":"#d9c8a9"},
  "kacho_ga": {"bg":"#402b23","border":"#a64833","title":"#bf4a3f","line":"#a64833","point":"#a64833","grid":"#a64833","text":"#d9c8a9"},
  "kanagawa-wave": {"bg":"#1f1f28","border":"#2a2a37","title":"#7e9cd8","line":"#7e9cd8","point":"#ffa066","grid":"#363646","text":"#dcd7ba"},
  "kanagawa_wave": {"bg":"#1f1f28","border":"#2a2a37","title":"#7e9cd8","line":"#7e9cd8","point":"#ffa066","grid":"#363646","text":"#dcd7ba"},
  "lackluster": {"bg":"#080808","border":"#222222","title":"#789978","line":"#789978","point":"#708090","grid":"#1e1e1e","text":"#a0a0a0"},
  "maroongold": {"bg":"#260000","border":"#f7ef8a","title":"#f7ef8a","line":"#f7ef8a","point":"#f7ef8a","grid":"#f7ef8a","text":"#e0aa3e"},
  "material-palenight": {"bg":"#292d3e","border":"#89ddff","title":"#c792ea","line":"#89ddff","point":"#89ddff","grid":"#89ddff","text":"#a6accd"},
  "material_palenight": {"bg":"#292d3e","border":"#89ddff","title":"#c792ea","line":"#89ddff","point":"#89ddff","grid":"#89ddff","text":"#a6accd"},
  "melange": {"bg":"#282522","border":"#34302a","title":"#e49b5d","line":"#e49b5d","point":"#85ad85","grid":"#3d3833","text":"#ece1d7"},
  "merko": {"bg":"#0a0f0b","border":"#b7d364","title":"#abd200","line":"#b7d364","point":"#b7d364","grid":"#b7d364","text":"#68b587"},
  "midnight-purple": {"bg":"#000000","border":"#9f4bff","title":"#9745f5","line":"#9f4bff","point":"#9f4bff","grid":"#9f4bff","text":"#ffffff"},
  "midnight_purple": {"bg":"#000000","border":"#9f4bff","title":"#9745f5","line":"#9f4bff","point":"#9f4bff","grid":"#9f4bff","text":"#ffffff"},
  "moltack": {"bg":"#f5e1c0","border":"#86092c","title":"#86092c","line":"#86092c","point":"#86092c","grid":"#86092c","text":"#574038"},
  "monokai": {"bg":"#272822","border":"#e28905","title":"#eb1f6a","line":"#e28905","point":"#e28905","grid":"#e28905","text":"#f1f1eb"},
  "neon": {"bg":"#000000","border":"#ffffff","title":"#00ead3","line":"#00ead3","point":"#00ead3","grid":"#ffffff","text":"#ff449f"},
  "nightfox": {"bg":"#192330","border":"#29394f","title":"#719cd6","line":"#719cd6","point":"#d67ad2","grid":"#2b3b51","text":"#cdcecf"},
  "nightowl": {"bg":"#011627","border":"#ffeb95","title":"#c792ea","line":"#ffeb95","point":"#ffeb95","grid":"#ffeb95","text":"#7fdbca"},
  "noctis-minimus": {"bg":"#1b2932","border":"#72b7c0","title":"#d3b692","line":"#72b7c0","point":"#72b7c0","grid":"#72b7c0","text":"#c5cdd3"},
  "noctis_minimus": {"bg":"#1b2932","border":"#72b7c0","title":"#d3b692","line":"#72b7c0","point":"#72b7c0","grid":"#72b7c0","text":"#c5cdd3"},
  "nord": {"bg":"#2e3440","border":"#88c0d0","title":"#81a1c1","line":"#88c0d0","point":"#88c0d0","grid":"#88c0d0","text":"#d8dee9"},
  "ocean-dark": {"bg":"#151a28","border":"#ffffff","title":"#8957b2","line":"#ffffff","point":"#ffffff","grid":"#ffffff","text":"#92d534"},
  "ocean_dark": {"bg":"#151a28","border":"#ffffff","title":"#8957b2","line":"#ffffff","point":"#ffffff","grid":"#ffffff","text":"#92d534"},
  "omni": {"bg":"#191622","border":"#e7de79","title":"#ff79c6","line":"#e7de79","point":"#e7de79","grid":"#e7de79","text":"#e1e1e6"},
  "one-dark-pro": {"bg":"#23272e","border":"#3b4048","title":"#61afef","line":"#c678dd","point":"#c678dd","grid":"#3b4048","text":"#e5c06e"},
  "one_dark_pro": {"bg":"#23272e","border":"#3b4048","title":"#61afef","line":"#c678dd","point":"#c678dd","grid":"#3b4048","text":"#e5c06e"},
  "onedark": {"bg":"#282c34","border":"#8eb573","title":"#e4bf7a","line":"#8eb573","point":"#8eb573","grid":"#8eb573","text":"#df6d74"},
  "outrun": {"bg":"#141439","border":"#ff1aff","title":"#ffcc00","line":"#ff1aff","point":"#ff1aff","grid":"#ff1aff","text":"#8080ff"},
  "panda": {"bg":"#31353a","border":"#19f9d899","title":"#19f9d899","line":"#19f9d899","point":"#19f9d899","grid":"#19f9d899","text":"#ff75b5"},
  "poimandres": {"bg":"#1b1e28","border":"#303340","title":"#5de4c7","line":"#5de4c7","point":"#add7ff","grid":"#252832","text":"#a6accd"},
  "prussian": {"bg":"#172f45","border":"#38a0ff","title":"#bddfff","line":"#38a0ff","point":"#38a0ff","grid":"#38a0ff","text":"#6e93b5"},
  "radical": {"bg":"#141321","border":"#2e2a4a","title":"#fe428e","line":"#fe428e","point":"#f8d847","grid":"#2e2a4a","text":"#a9fef7"},
  "react": {"bg":"#20232a","border":"#3a3f4a","title":"#61dafb","line":"#61dafb","point":"#ffffff","grid":"#343842","text":"#c9d1d9"},
  "rose": {"bg":"#e9d8d4","border":"#e9d8d4","title":"#8d192b","line":"#b71f36","point":"#b71f36","grid":"#e9d8d4","text":"#862931"},
  "rose-pine": {"bg":"#191724","border":"#ebbcba","title":"#9ccfd8","line":"#ebbcba","point":"#ebbcba","grid":"#ebbcba","text":"#e0def4"},
  "rose-pine-dawn": {"bg":"#faf4ed","border":"#dfdad9","title":"#286983","line":"#56949f","point":"#d7827e","grid":"#dfdad9","text":"#575279"},
  "rose-pine-moon": {"bg":"#232136","border":"#393552","title":"#9ccfd8","line":"#9ccfd8","point":"#ebbcba","grid":"#393552","text":"#e0def4"},
  "rose_pine": {"bg":"#191724","border":"#ebbcba","title":"#9ccfd8","line":"#ebbcba","point":"#ebbcba","grid":"#ebbcba","text":"#e0def4"},
  "rose_pine_dawn": {"bg":"#faf4ed","border":"#dfdad9","title":"#286983","line":"#56949f","point":"#d7827e","grid":"#dfdad9","text":"#575279"},
  "rose_pine_moon": {"bg":"#232136","border":"#393552","title":"#9ccfd8","line":"#9ccfd8","point":"#ebbcba","grid":"#393552","text":"#e0def4"},
  "shades-of-purple": {"bg":"#2d2b55","border":"#b362ff","title":"#fad000","line":"#b362ff","point":"#b362ff","grid":"#b362ff","text":"#a599e9"},
  "shades_of_purple": {"bg":"#2d2b55","border":"#b362ff","title":"#fad000","line":"#b362ff","point":"#b362ff","grid":"#b362ff","text":"#a599e9"},
  "shadow-blue": {"bg":"#ffffff00","border":"#004490","title":"#00779a","line":"#004450","point":"#004450","grid":"#004490","text":"#444444"},
  "shadow-green": {"bg":"#ffffff00","border":"#003d00","title":"#007a00","line":"#003d00","point":"#003d00","grid":"#003d00","text":"#444444"},
  "shadow-red": {"bg":"#ffffff00","border":"#4f0000","title":"#9a0000","line":"#4f0000","point":"#4f0000","grid":"#4f0000","text":"#444444"},
  "shadow_blue": {"bg":"#ffffff00","border":"#004490","title":"#00779a","line":"#004450","point":"#004450","grid":"#004490","text":"#444444"},
  "shadow_green": {"bg":"#ffffff00","border":"#003d00","title":"#007a00","line":"#003d00","point":"#003d00","grid":"#003d00","text":"#444444"},
  "shadow_red": {"bg":"#ffffff00","border":"#4f0000","title":"#9a0000","line":"#4f0000","point":"#4f0000","grid":"#4f0000","text":"#444444"},
  "slateorange": {"bg":"#36393f","border":"#faa627","title":"#faa627","line":"#faa627","point":"#faa627","grid":"#faa627","text":"#ffffff"},
  "snazzy": {"bg":"#282a36","border":"#44475a","title":"#57c7ff","line":"#57c7ff","point":"#ff6ac1","grid":"#3a3c4e","text":"#eff0eb"},
  "solarized-dark": {"bg":"#002b36","border":"#b58900","title":"#268bd2","line":"#b58900","point":"#b58900","grid":"#b58900","text":"#859900"},
  "solarized-light": {"bg":"#fdf6e3","border":"#b58900","title":"#268bd2","line":"#b58900","point":"#b58900","grid":"#b58900","text":"#859900"},
  "solarized_dark": {"bg":"#002b36","border":"#b58900","title":"#268bd2","line":"#b58900","point":"#b58900","grid":"#b58900","text":"#859900"},
  "solarized_light": {"bg":"#fdf6e3","border":"#b58900","title":"#268bd2","line":"#b58900","point":"#b58900","grid":"#b58900","text":"#859900"},
  "swift": {"bg":"#f7f7f7","border":"#f05237","title":"#000000","line":"#f05237","point":"#f05237","grid":"#f05237","text":"#000000"},
  "synthwave": {"bg":"#2b213a","border":"#ef8539","title":"#e2e9ec","line":"#ef8539","point":"#ef8539","grid":"#ef8539","text":"#e5289e"},
  "tokyo-night": {"bg":"#1a1b27","border":"#2a2e4a","title":"#7aa2f7","line":"#7aa2f7","point":"#bb9af7","grid":"#2a2e4a","text":"#9aa5ce"},
  "tokyo-night-light": {"bg":"#d5d6db","border":"#a8aecb","title":"#34548a","line":"#34548a","point":"#9854f1","grid":"#b6b9cc","text":"#343b58"},
  "tokyo-night-storm": {"bg":"#24283b","border":"#414868","title":"#7aa2f7","line":"#7aa2f7","point":"#bb9af7","grid":"#2f354d","text":"#c0caf5"},
  "tokyo_night": {"bg":"#1a1b27","border":"#2a2e4a","title":"#7aa2f7","line":"#7aa2f7","point":"#bb9af7","grid":"#2a2e4a","text":"#9aa5ce"},
  "tokyo_night_light": {"bg":"#d5d6db","border":"#a8aecb","title":"#34548a","line":"#34548a","point":"#9854f1","grid":"#b6b9cc","text":"#343b58"},
  "tokyo_night_storm": {"bg":"#24283b","border":"#414868","title":"#7aa2f7","line":"#7aa2f7","point":"#bb9af7","grid":"#2f354d","text":"#c0caf5"},
  "tokyonight": {"bg":"#1a1b27","border":"#bf91f3","title":"#70a5fd","line":"#bf91f3","point":"#bf91f3","grid":"#bf91f3","text":"#38bdae"},
  "transparent": {"bg":"#ffffff00","border":"#0579c3","title":"#006aff","line":"#0579c3","point":"#0579c3","grid":"#0579c3","text":"#417e87"},
  "vision-friendly-dark": {"bg":"#000000","border":"#785ef0","title":"#ffb000","line":"#785ef0","point":"#785ef0","grid":"#785ef0","text":"#ffffff"},
  "vision_friendly_dark": {"bg":"#000000","border":"#785ef0","title":"#ffb000","line":"#785ef0","point":"#785ef0","grid":"#785ef0","text":"#ffffff"},
  "vitesse-dark": {"bg":"#121212","border":"#222222","title":"#4d9375","line":"#4d9375","point":"#c98a7d","grid":"#222222","text":"#dbd7ca"},
  "vitesse-light": {"bg":"#ffffff","border":"#e5e5e5","title":"#1c6b48","line":"#1c6b48","point":"#b07d48","grid":"#eeeeee","text":"#393a34"},
  "vitesse_dark": {"bg":"#121212","border":"#222222","title":"#4d9375","line":"#4d9375","point":"#c98a7d","grid":"#222222","text":"#dbd7ca"},
  "vitesse_light": {"bg":"#ffffff","border":"#e5e5e5","title":"#1c6b48","line":"#1c6b48","point":"#b07d48","grid":"#eeeeee","text":"#393a34"},
  "vue": {"bg":"#fffefe","border":"#41b883","title":"#41b883","line":"#41b883","point":"#41b883","grid":"#41b883","text":"#273849"},
  "vue-dark": {"bg":"#273849","border":"#41b883","title":"#41b883","line":"#41b883","point":"#41b883","grid":"#41b883","text":"#fffefe"},
  "vue_dark": {"bg":"#273849","border":"#41b883","title":"#41b883","line":"#41b883","point":"#41b883","grid":"#41b883","text":"#fffefe"},
  "yeblu": {"bg":"#002046","border":"#ffff00","title":"#ffff00","line":"#ffff00","point":"#ffff00","grid":"#ffff00","text":"#ffffff"},
};
THEMES["synthwave_84"] = THEMES["synthwave"];

const FONT = "Segoe UI, Ubuntu, sans-serif";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function getTheme(name) {
  return THEMES[name] || THEMES["github-dark"];
}

// Normalize a hex color: optional leading "#", 3, 6, or 8 hex digits.
// Returns "#rrggbb" / "#rrggbbaa" (lowercase) or null when invalid.
function normHex(raw) {
  if (raw == null) return null;
  let v = String(raw).trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(v)) v = v.split("").map((c) => c + c).join("");
  if (/^[0-9a-fA-F]{6}$/.test(v) || /^[0-9a-fA-F]{8}$/.test(v)) return "#" + v.toLowerCase();
  return null;
}

// Parse a color parameter following the github-readme-stats convention:
// either a plain hex color or a gradient spec "angle,color1,color2,..."
// (up to 6 colors). Returns { hex } or { gradient: { angle, colors } },
// or null when invalid (callers then fall back silently).
function parseColorParam(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  if (s.includes(",")) {
    const parts = s.split(",").map((p) => p.trim()).filter((p) => p.length);
    if (parts.length >= 3) {
      const angle = Number(parts[0]);
      const colors = parts.slice(1, 7).map((c) => normHex(c)).filter(Boolean);
      if (Number.isFinite(angle) && colors.length >= 2) {
        return { gradient: { angle, colors } };
      }
    }
    return null;
  }
  const hex = normHex(s);
  return hex ? { hex } : null;
}

// Resolve the effective style for a card request: theme first, then the
// customization parameters on top. Priority: explicit param > theme >
// default. Invalid values are ignored, never an error.
function resolveStyle(q) {
  const theme = { ...(THEMES[(q.theme || "github-dark").toString()] || THEMES["github-dark"]) };

  const bg = parseColorParam(q.bg_color);
  if (bg) {
    if (bg.gradient) {
      theme.bgGradient = bg.gradient;
      theme.bg = bg.gradient.colors[0];
    } else {
      theme.bg = bg.hex;
      delete theme.bgGradient;
    }
  }
  const titleC = normHex(q.title_color);
  if (titleC) theme.title = titleC;
  const textC = normHex(q.text_color);
  if (textC) theme.text = textC;
  const borderC = normHex(q.border_color);
  if (borderC) { theme.border = borderC; theme.grid = borderC; }
  const lineC = normHex(q.line);
  if (lineC) theme.line = lineC;
  const pointC = normHex(q.point);
  if (pointC) theme.point = pointC;
  // Accent for key numbers: ring_color wins, fire is its streak alias.
  theme.accent = normHex(q.ring_color) || normHex(q.fire) || theme.title;

  let borderRadius = null;
  if (q.border_radius != null && q.border_radius !== "") {
    const r = parseFloat(q.border_radius);
    if (Number.isFinite(r)) borderRadius = Math.min(30, Math.max(0, r));
  }

  return {
    theme,
    hideBorder: String(q.hide_border) === "true",
    hideTitle: String(q.hide_title) === "true",
    borderRadius,
    customTitle: q.custom_title != null && String(q.custom_title) !== ""
      ? String(q.custom_title).slice(0, 80)
      : null,
  };
}

function gradientDef(id, gradient) {
  const stops = gradient.colors.map((c, i) => {
    const pct = gradient.colors.length === 1 ? 0 : Math.round((i / (gradient.colors.length - 1)) * 100);
    const color = c.length === 9 ? c.slice(0, 7) : c;
    const opacity = c.length === 9 ? ` stop-opacity="${(parseInt(c.slice(7, 9), 16) / 255).toFixed(3)}"` : "";
    return `<stop offset="${pct}%" stop-color="${color}"${opacity}/>`;
  }).join("");
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(${gradient.angle} 0.5 0.5)">${stops}</linearGradient>`;
}

function parseUsername(q) {
  return (q.username || "xsrazy").toString().replace(/[^a-zA-Z0-9-]/g, "").slice(0, 39) || "xsrazy";
}

function displayName(username) {
  return username.charAt(0).toUpperCase() + username.slice(1);
}

function fmt(n) {
  return Number(n).toLocaleString("en-US");
}

// Same data source as api/graph.js: github-contributions-api (jogruber) v4.
async function fetchContributions(username) {
  const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`;
  const res = await fetch(url, { headers: { "User-Agent": "activity-graph/1.0" } });
  if (!res.ok) throw new Error(`contributions api ${res.status}`);
  const data = await res.json();
  const list = Array.isArray(data.contributions) ? data.contributions : [];
  return list
    .filter((d) => d && d.date && typeof d.count === "number")
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

function ghHeaders() {
  // A token only raises rate limits (unauthenticated calls from shared
  // serverless egress IPs get throttled hard). Public-only results are
  // enforced separately: search queries carry is:public and repo lists are
  // filtered on the API's own `private` flag, so no private data can leak
  // into a card even when the token belongs to the profile owner.
  const h = {
    "User-Agent": "activity-graph/1.0",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function ghJSON(url) {
  const res = await fetch(url, { headers: ghHeaders() });
  if (!res.ok) {
    const err = new Error(`github api ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function fetchProfile(username) {
  return ghJSON(`https://api.github.com/users/${encodeURIComponent(username)}`);
}

async function fetchRepos(username) {
  const repos = [];
  for (let page = 1; page <= 3; page++) {
    const batch = await ghJSON(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&type=owner&sort=updated`
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

async function fetchSearchCount(kind, username) {
  const data = await ghJSON(
    `https://api.github.com/search/issues?q=type:${kind}+author:${encodeURIComponent(username)}+is:public&per_page=1`
  );
  return typeof data.total_count === "number" ? data.total_count : null;
}

async function fetchRepoLanguages(languagesUrl) {
  return ghJSON(languagesUrl);
}

function cardShell({ width, height, theme, title, body, hideTitle = false, hideBorder = false, borderRadius = null }) {
  const t = theme;
  const effH = hideTitle ? height - 34 : height;
  const r = borderRadius == null ? 8 : borderRadius;
  const stroke = hideBorder ? "none" : t.border;
  const defs = t.bgGradient ? `\n<defs>${gradientDef("bggrad", t.bgGradient)}</defs>` : "";
  const fill = t.bgGradient ? "url(#bggrad)" : t.bg;
  const titleLine = hideTitle ? "" : `\n<text x="24" y="36" font-family="${FONT}" font-size="19" font-weight="600" fill="${t.title}">${esc(title)}</text>`;
  const groupAttrs = hideTitle ? ` font-family="${FONT}" transform="translate(0,-34)"` : ` font-family="${FONT}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${effH}" viewBox="0 0 ${width} ${effH}" fill="none">${defs}
<rect x="0.5" y="0.5" width="${width - 1}" height="${effH - 1}" rx="${r}" fill="${fill}" stroke="${stroke}"/>${titleLine}
<g${groupAttrs}>${body}</g>
</svg>`;
}

function errorCard({ username, theme, message, title, hideTitle = false, hideBorder = false, borderRadius = null, customTitle = null }) {
  return cardShell({
    width: 495,
    height: 130,
    theme,
    title: customTitle || title || `${displayName(username)}'s GitHub Stats`,
    hideTitle,
    hideBorder,
    borderRadius,
    body: `<text x="24" y="76" font-size="14" fill="${theme.text}">${esc(message)}</text>`,
  });
}

function sendSVG(res, svg, cacheSeconds) {
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`);
  res.status(200).send(svg);
}

module.exports = {
  THEMES, FONT, esc, getTheme, normHex, parseColorParam, resolveStyle, gradientDef,
  parseUsername, displayName, fmt,
  fetchContributions, fetchProfile, fetchRepos, fetchSearchCount, fetchRepoLanguages,
  cardShell, errorCard, sendSVG,
};
