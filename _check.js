const babel = require('@babel/core');
const fs = require('fs');
const files = ['src/components/perfil/PerfilUI.jsx','src/pages/PerfilUsuario.jsx','src/data/data_falso.js','src/utils/moneda.js','src/components/icons/Icon.jsx'];
let ok = true;
for (const f of files) {
  try {
    babel.parseSync(fs.readFileSync(f,'utf8'), { filename: f, presets: [require.resolve('@babel/preset-react')], sourceType:'module', configFile:false, babelrc:false });
    console.log('OK  ', f);
  } catch (e) { ok = false; console.log('FAIL', f, '\n', e.message); }
}
process.exit(ok?0:1);
