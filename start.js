const { spawn } = require('child_process');

console.log(' Testler başlatılıyor\n');

const testProcess = spawn('npx', ['jest'], {
    stdio: 'inherit',
    shell: true
});

testProcess.on('close', (code) => {
    if (code !== 0) {
        console.error(` Testler başarısız oldu. Çıkış kodu: ${code}`);
        process.exit(code);
    }

    console.log('\n Testler başarılı. Sunucu başlatılıyor\n');
    require('./server');
});
