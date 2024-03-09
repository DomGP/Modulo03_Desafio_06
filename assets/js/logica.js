const inputCLP = document.getElementById('inputCLP'); //Variable de input CLP
const mensaje = document.getElementById('mensaje'); //Variable de input vacío
const selectMoneda = document.getElementById('moneda') //Variable de select moneda
const btnConvertir = document.getElementById('btn'); //Boton de conversión
const resultado = document.getElementById('resultado'); //Variable que muestra la conversión
const myChart = document.getElementById('myChart'); //Variable que muestra la gráfica
let chart

//FUNCIÓN PARA LLAMAR A LA API DE CONVERSIÓN
async function getMoneda(){
    const endpoint = 'https://mindicador.cl/api/';
    try{
        const res = await fetch(endpoint);
        const dataMonedas = await res.json();
        const montoCLP = Number(inputCLP.value)
        if(montoCLP == '' && montoCLP <= 0){
            let alerta = `<span class='alertaMensaje'>Deebes agregar un valor valido</span>`
            mensaje.innerHTML=alerta
        }else{
            const monedaTipo = selectMoneda.options[selectMoneda.selectedIndex].value;
            const operacion = (montoCLP / dataMonedas[monedaTipo].valor).toFixed(2);
            resultado.innerHTML = `Resultado: $${operacion} ${monedaTipo.toUpperCase()}`
            mensaje.innerHTML=''
            grafico(monedaTipo, dataMonedas[monedaTipo].nombre)
        }
    } catch(error){
        console.error('Error al obtener la tasa de cambio', error);
    }
}

btnConvertir.addEventListener('click', function(){
    getMoneda();
    ;
})

//FUNCIÓN GRAFICA
const grafico = async(variable, nombreMoneda)=>{
    const res = await fetch(`https://mindicador.cl/api/${variable}`);
    const data = await res.json();
    let series = data.serie.slice(0,9)
    let fechas = series.map(item => {
        return new Date(item.fecha).toLocaleDateString('en-GB')
    })
    let valores = series.map(item =>{
        return item.valor
    })

    const xValues = fechas.reverse();
    const yValues = valores.reverse();

    if(chart){
        chart.destroy();
    }
    chart = new Chart('myChart',{
        type:'line',
        data:{
            labels:xValues,
            datasets:[{
                label:nombreMoneda,
                fill:false,
                lineTension:0,
                backgroundColor: 'rgb(49,210,242)',
                borderColor: 'rgba(108,117,125)',
                data:yValues,
            }]
        }
    })
}