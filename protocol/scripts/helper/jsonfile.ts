import path from 'path';
import fs from 'fs';



export function saveJSONFile(filename: string, data: any) {
    
    // make parent directory if it does not exist
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    // write json file 

    const json = JSON.stringify(data, null, 2);

    fs.writeFileSync(filename, json);
}


export function loadJSONFile(filename: string) {

    // read file and parse json

    const s = fs.readFileSync(filename, 'utf8');

    const data = JSON.parse(s);

    return data;

}