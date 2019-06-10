import fs from 'fs-extra';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import uglifycss from 'uglifycss';

// The base path for all resources (images, audio, etc.)
let basePath = (process.env.npm_package_config_basePath || "").trim();

// Clear previous
fs.removeSync('./build/');

// Copy everything
fs.copySync('./app/', './build/');

// Update HTML JavaScript tag to no longer read as ES6 module and move reference
let html = fs.readFileSync('./build/index.html').toString();
html = html.replace(/type="module" src="scripts\/main\.js"/g, 'src="main.js"');
fs.writeFileSync('./build/index.html', html);

// Babel and minify
export default {
    input: './app/scripts/main.js',
    output: {
        file: './build/main.js',
        format: 'iife',
        name: 'finlit'
    },
    plugins: [ 
        babel(),
        minify( {
            // Options for babel-minify.
            comments: false
        }),
        {
            name: 'pull-templates',
            load( id ) {
                // Pull templates into local vairables
                // Look for equivalent of "let template = fetch('...", lookup the html, replace with "let template = 'html'"
                let js = fs.readFileSync(id).toString();
                let matches = js.match(/let[\s\S]template[\s\S]=[\s\S]await[\s\S]fetch\(['"](.*?)['"]\);[\s\S]*?template[\s\S]=[\s\S]await[\s\S]template.text\(\);/g);

                if(matches){
                    for(let match of matches){
                        let templateFile = /fetch\(\'(.*?)\'\)/g.exec(match)[1];
                        let template = fs.readFileSync('./app/' + templateFile).toString();

                        // Process CSS
                        if(templateFile.split(".").pop() === "css"){
                            template = uglifycss.processString(template);
                        }

                        // Fix relative URLs
                        template = template.replace(/\...res\/|res\//g, basePath + 'res/');

                        // Replace all linebreaks and escape quotes
                        template = template.replace(/(\r\n|\n|\r)/gm, "").replace(/\"/g, "\\\"");

                        js = js.replace(match, `let template = "${template}"`);
                    }
                }

                return js;
            }
        },
        {
            name: 'cleanup',
            writeBundle( options, bundle ){
                // Remove unused folders
                fs.removeSync('./build/res/index.js');
                fs.removeSync('./build/components/');
                fs.removeSync('./build/routes/');
                fs.removeSync('./build/styles/');
                fs.removeSync('./build/scripts/');
                fs.removeSync('./build/lib/');
            }
        }
    ]
}