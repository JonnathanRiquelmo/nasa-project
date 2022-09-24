const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')


const FILE_NAME = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
const habitablePlanets = []

// research source: https://www.centauri-dreams.org/2015/01/30/a-review-of-the-best-habitable-planet-candidates/
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(FILE_NAME)
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', (data) => {
                if (isHabitablePlanet(data)) {
                    habitablePlanets.push(data)
                }
            })
            .on('error', (err) => {
                console.error('------ Ooops, an exception has occurred ------\n\n' + err)
                reject()
            })
            .on('end', () => {
                console.table(habitablePlanets.map((planet) => {
                    return planet['kepler_name']
                }))
                console.log(`${habitablePlanets.length} habitable planets found!! :)`)
                // research source: https://phl.upr.edu/projects/habitable-exoplanets-catalog
                resolve()
            })
    })
}

module.exports = {
    loadPlanetsData,
    planets: habitablePlanets
}