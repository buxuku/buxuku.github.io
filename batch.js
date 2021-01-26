const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'source/_posts'), (err, data) => {
    data.forEach(item => {
        const content = fs.readFileSync(path.join(__dirname, 'source/_posts/', item), 'utf-8');
        const newContent = content.replace(/(?<=[\s\S]*)(date.*\n)/, function (match, p1) {
                return `${p1}${p1.replace('date', 'updated')}`;
            }
            )
        ;
        fs.writeFileSync(path.join(__dirname, 'source/_posts', item), newContent);
    })
})