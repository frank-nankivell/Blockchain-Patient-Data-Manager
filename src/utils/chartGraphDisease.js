const chartGraphDisease = (info) =>
  new Promise((resolve, reject) => {

    // function to convert data into graphical info
    let diseaseArray;
    let counts = {};
    // this sets to summarise by disease
    diseaseArray = info.map(x => x.data.Disease_1);
    diseaseArray.forEach(function(x) { counts[x] = (counts[x] || 0)+1; })
    console.log('counts: ',JSON.stringify(counts))
    const chartData = [['Disease Name', 'Count']]
    const names = Object.keys(counts)
    console.log('names: ',JSON.stringify(names))
    const Values = Object.values(counts)
    console.log('values: ',JSON.stringify(Values))

    for (let i = 0; i < names.length; i += 1) {
        chartData.push([names[i], Values[i]])
      }
      
    /*names.forEach(element => { 
        chartData.push([names[element], Values[element]])
        console.log('chart data',JSON.stringify(chartData))
    })*/
    
    if (chartData==null || undefined ) {
        reject('error') 
    } else 
    {
    resolve(chartData);
    };
   
});

export default chartGraphDisease;