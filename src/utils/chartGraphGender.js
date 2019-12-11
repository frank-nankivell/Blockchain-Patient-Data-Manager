const chartGraphGender = (info) =>
  new Promise((resolve, reject) => {

    // function to convert data into graphical info
    let genderArry
    let countsGender = {};
    genderArry = info.map(x => x.data.Gender);
    genderArry.forEach(function(x) { countsGender[x] = (countsGender[x] || 0)+1; });
    const chartDataGender = [['Gender', 'Count']]
    const namesGender = Object.keys(countsGender)
    const ValuesGender = Object.values(countsGender)
    // -
    /*
    namesGender.forEach(element => { 
        chartDataGender.push([namesGender[element], ValuesGender[element]])
    })
    */
    for (let i = 0; i < namesGender.length; i += 1) {
        chartDataGender.push([namesGender[i], ValuesGender[i]])
      }

    if (chartDataGender==null || undefined ) {
        reject('error') 
    } else 
    {
    resolve(chartDataGender);
    };

});

export default chartGraphGender;