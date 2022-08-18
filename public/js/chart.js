const ctx = document.getElementById('myChart').getContext('2d');
const ctx1 = document.getElementById('myChart1').getContext('2d');
let dataTopUp = document.querySelector('.dataTopUp').getAttribute('data-chart')
let dataWithdraw = document.querySelector('.dataWithdraw').getAttribute('data-chart')
let dataTransfer = document.querySelector('.dataTransfer').getAttribute('data-chart')
let dataGetMoney = document.querySelector('.dataGetMoney').getAttribute('data-chart')
let dataBuyCard = document.querySelector('.dataBuyCard').getAttribute('data-chart')
let nameTopUp = document.querySelector('.dataTopUp').getAttribute('data-name')
let nameWithdraw = document.querySelector('.dataWithdraw').getAttribute('data-name')
let nameTransfer = document.querySelector('.dataTransfer').getAttribute('data-name')
let nameGetMoney = document.querySelector('.dataGetMoney').getAttribute('data-name')
let nameBuyCard = document.querySelector('.dataBuyCard').getAttribute('data-name')
let dataChart = [dataTopUp, dataWithdraw, dataTransfer, dataGetMoney, dataBuyCard]
let nameChart = [nameTopUp, nameWithdraw, nameTransfer, nameGetMoney, nameBuyCard]

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: nameChart,
        datasets: [{
            label: '# Number of transactions',
            data: dataChart,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }
    ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Total transactions Chart'
          }
        }
    }
});
const myChart1 = new Chart(ctx1, {
    type: 'doughnut',
    data: {
        labels: nameChart,
        datasets: [{
            label: '# of Votes',
            data: dataChart,
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff'  
            ],
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Doughnut Chart'
          }
        }
    }
});