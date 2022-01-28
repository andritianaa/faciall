const fs = require('fs');
const faceapi = require("face-api.js");
const compareFace = require('./compareFace.js');
const createDescriptorFile = require('./createDescriptorFile.js');
const perf = require("perf_hooks");

async function searchProcess(imgDescriptor) {
    found = false;
    let distanceResult;
    let correspondance_list = [];
    let id = 0;
    let i = 1;
    let referencePath;
    genre = imgDescriptor.gender;
    const personNumber = fs.readdirSync(`./public/faces/${genre}s`).length;
    // asesy ny sary anakiroa
    while (i <= 2 && found == false) {
        //tetezina ny olona tsirairay / genre
        for (let j = 1; j <= personNumber; j++) {
            //manomboka 1 ny id, id an'olona iray ihany ny anarana dossier misy azy anaty dir
            j
            referencePath = `./public/faces/${genre}s/${j}/${i}.json`;
            //comparena ilay imgDescriptor (ilay descriptor an'olona tadiavina)
            let compareResult = compareFace.compareObjectJSON(imgDescriptor, referencePath);
            compareResult = (await compareResult).distance;
            /**raha kely noho ny treshold ny resultat an'ny comparaison dia marquena true ny found satria misy tarehy izany
             * atsofoka anaty liste ana correspondance ny id an'izay inferieur an'ny treshold
             */
            console.log(compareResult);
            if (compareResult < 0.5) {
                found = true;
            } else {
                found = false;
            }

            if (compareResult < 0.45) {
                found = true;
                correspondance_list.push({
                    id: j
                });
                console.log(`Correspondance ${genre} ${j} ${i}`);
                //raha inferieur an'ny 0.3 ny distance azo avy amin'ny comparaison dia hita avy hatrany ilay olona
                if (compareResult < 0.3) {
                    max = {
                        id: j,
                        difference: compareResult
                    };
                    console.log(max);
                    return max;
                }
            } else {
                console.log(`Not ${genre} ${j} ${i}`);
            }
        }
        if (found == false) {
            return 404;
        }
        console.log(correspondance_list);
        //raha iray fotsiny ny ao anaty liste ana correspondace, dia izy avy hatrany ilay tadiavina
        if (correspondance_list.length == 1) {
            max = {
                id: correspondance_list[0]
            }
            console.log(max);
            return max;
            //raha vide ny liste sady efa ireo sary faharoa no nojerena dia tsy mbola fantatra ilay olona
        } else if (correspondance_list.length == 0 && i == 2) {
            console.log("not found");
            return {
                id: 0
            }
        } else if (correspondance_list.length == 0) {
            //raha vide ilay liste de mifindra ao amin'ny sary faharoa
            i = 2;
            j = 1;
        } else {
            //rahamihoatra ny 1 ny anaty liste
            max = {
                id: null,
                difference: 0.45
            };
            //ilay liste ana sary manaraka no tohizana anaovana comparaison
            tmp = i++;
            correspondance_list.forEach((el, index = 0, correspondance_list) => {
                //chemin makany amin'ny descriptor
                referencePath = `./public/faces/${genre}s/${el.id}/${tmp}.json`;
                //comparaison
                compareResult = compareFace.compareObjectJSON(imgDescriptor, referencePath);

                //izay manana distance manakaiky an'ny 0 indrindra no izy
                if (compareResult.distance < max.difference || max.id == null) {
                    max = {
                        id: el.id
                    }
                    console.log(max);
                }
            });
            return max;
        }
    }
    console.log("not found");
    return 404;
}


const search = async (fileName) => {
    console.log("descripting");

    let start = performance.now();
    imgDescriptor = await createDescriptorFile.description(`uploads/${fileName}`);
    let end = performance.now();
    let execTime = end - start;
    console.log(`Done in ${execTime} ms\n\n`);
    console.log("descripted");
    console.log("in search");
    start = performance.now();
    searchResult = await searchProcess(imgDescriptor);
    end = performance.now();
    execTime = end - start;
    console.log(searchResult);
    if (searchResult == 404) {
        console.log("Personne inconnue");
    } else if (searchResult.id.id == undefined) {
        console.log("Personne inconnue");
    } else {
        console.log(`ID trouvé: ${searchResult.id.id}`);
    }
    console.log(`Done in ${execTime} ms`);
}
search(`unk.jpg`);
module.exports.search = search;