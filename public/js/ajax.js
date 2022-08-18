var socket = io()
$(document).ready(function(){
    $('#btnShowMoney').click(function(){
        let spanShowMoney = $('#spanShowMoney')
        let moneySpan = $('#spanShowMoney').attr('data-money')
        console.log(moneySpan)
        if(spanShowMoney.text() === '**********'){
            $('#eyeShowMoney').attr('name', 'eye-sharp')
            $('#spanShowMoney').text(moneySpan)
        }else{
            $('#spanShowMoney').text('**********')
            $('#eyeShowMoney').attr('name', 'eye-off-sharp')
        }
    })
})
setTimeout(function() {
    $('.alert_success').fadeOut('fast')
}, 4000);
let idUser = $('#idUser').val()
//User emit - > server when login
if(idUser){
    socket.on('connect', () =>{
        socket.emit('connected', idUser)
    })
}
// Top up
$(document).ready(function(){
    $('#btnTopUp').click(function(){
        let cardNumberTopUp = $('#card_number_tu').val()
        let expiryDateTopUp = $('#expiry_date_tu').val()
        let cvvTopUp = $('#cvv_tu').val()
        let moneyTopUP = $('#money_tu').val()
        if(cardNumberTopUp == ''){
            $('.span_error').html('Please enter your card number.')
        }
        if(expiryDateTopUp == ''){
            $('.span_error').html('Please enter your expiry date.')
        }
        if(cvvTopUp == ''){
            $('.span_error').html('Please enter your cvv.')
        }
        if(moneyTopUP == ''){
            $('.span_error').html('Please enter your money top up.')
        }
        if(cardNumberTopUp != '' && expiryDateTopUp != '' && cvvTopUp != '' && moneyTopUP != ''){
            $('.span_error').html('')
            $.ajax({
                url: '/user/topUp',
                type: 'POST',
                data: {
                    card_num: cardNumberTopUp,
                    expiry_date: expiryDateTopUp,
                    cvv: cvvTopUp,
                    money: moneyTopUP
                }
            }).then(data=>{
                if(data.success=== true){
                    $('#card_number_tu').val('')
                    $('#expiry_date_tu').val('')
                    $('#cvv_tu').val('')
                    $('#money_tu').val('')
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 5000
                    })
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 5000
                    })
                }
            }).catch(err =>{
                console.log(err)
            })
        }
    })
})
// Withdraw
$(document).ready(function(){
    $('#btnWithdraw').click(function(){
        let cardNumberWithdraw = $('#card_number_wd').val()
        let expiryDateWithdraw = $('#expiry_date_wd').val()
        let cvvWithdraw = $('#cvv_wd').val()
        let moneyWithdraw = $('#money_wd').val()
        let noteWithdraw = $('#note_wd').val()
        if(cardNumberWithdraw ==''){
            $('.span_error_wd').html('Please enter your card number.')
        }
        if(expiryDateWithdraw == ''){
            $('.span_error_wd').html('Please enter your expiry date.')
        }
        if(cvvWithdraw ==''){
            $('.span_error_wd').html('Please enter your cvv.')
        }
        if(moneyWithdraw == ''){
            $('.span_error_wd').html('Please enter your money withdraw.')
        }
        if(cardNumberWithdraw != '' && expiryDateWithdraw != '' && cvvWithdraw != ''){
            $('.span_error_wd').html('')
            $.ajax({
                url: '/user/withdraw',
                type: 'POST',
                data:{
                    card_num: cardNumberWithdraw,
                    expiry_date: expiryDateWithdraw,
                    cvv: cvvWithdraw,
                    money: moneyWithdraw,
                    note: noteWithdraw
                }
            }).then(data=>{
                if(data.success=== true){
                    $('#card_number_wd').val('')
                    $('#expiry_date_wd').val('')
                    $('#cvv_wd').val('')
                    $('#money_wd').val('')
                    $('#note_wd').val('')
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 5000
                    })
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 5000
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
        }
        
    })
})
// Display information buy card
$(document).ready(function(){
    let cardValue = $('input[type=radio][name=card-value]').val()
    $('input[type=radio][name=supplier]').change(function(){
        $('#name_supplier').html('Supplier ' + this.value)  
    })
    $('input[type=radio][name=card-value]').change(function(){
        $('#par_card').html(this.value+'đ')
        cardValue = this.value
        $('#total_money_card').html('Total money: '+$('input[type=number][name=quanlity]').val()*cardValue+'đ')
    })
    $('ion-icon.minus').click(function(){
        $('#quantity_card').html('Quantity: x'+$('input[type=number][name=quanlity]').val())
        $('#total_money_card').html('Total money: '+$('input[type=number][name=quanlity]').val()*cardValue+'đ')
    })
    $('ion-icon.plus').click(function(){
        $('#quantity_card').html('Quantity: x'+$('input[type=number][name=quanlity]').val())
        $('#total_money_card').html('Total money: '+$('input[type=number][name=quanlity]').val()*cardValue+'đ')
    })
})
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
// Buy card
$(document).ready(function(){
    $('#btnBuyCard').click(function(){
        let quanlity = $('input[type=number][name=quanlity]').val()
        let cardValue = $('input[type=radio][name=card-value]:checked').val()
        let supplier = $('input[type=radio][name=supplier]:checked').val()
        if(supplier == undefined){
            Toast.fire({
                icon: 'error',
                title:'Please choose supplier when buy card.'
            })
        }
        if(cardValue == undefined){
            Toast.fire({
                icon: 'error',
                title:'Please choose card value when buy card.'
            })
        }
        if(quanlity == undefined){
            Toast.fire({
                icon: 'error',
                title:'Please choose quanlity when buy card.'
            })
        }
        if(supplier != undefined && cardValue != undefined && quanlity != undefined){
            $.ajax({
                url: '/user/buyCard',
                type: 'POST',
                data: {
                    telecomCard: supplier,
                    priceCard: cardValue,
                    quanlity: quanlity
                }
            }).then(data =>{
                if(data.success=== true){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 5000
                    })
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 5000
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})
// Transfer
$(document).ready(function(){
    // Check phone 
    let phoneTransfer
    $("#phone_transfer").bind("change", function() {
        phoneTransfer = $(this).val()
        if(phoneTransfer == ''){
            Toast.fire({
                icon: 'error',
                title:'Please enter the recipients phone number to transfer.'
            })
        }else{
            $.ajax({
                url: '/user/checkPhone',
                type: 'POST',
                data: {
                    phoneTransfer : phoneTransfer
                }
            }).then(data =>{
                if(data.success=== true){
                    let fullname = data.data.fullname
                    $('#name_transfer').val(fullname)
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: data.message
                    })
                    $('#phone_transfer').val('')
                    $('#name_transfer').val('')
                }
            }).catch(err =>{
                console.log(err)
            })
        }
    })
    let phonRecipient 
    let moneyTransfer
    let noteTransfer 
    let feeTransfer 
    $('#sendOTPVerify').click(function(){
        phonRecipient = $('#phone_transfer').val()
        moneyTransfer = $('#amount_transfer').val()
        noteTransfer = $('#note_transfer').val()
        feeTransfer = $('input[type=radio][name=fee-transfer]:checked').val()
        if(phonRecipient !== phoneTransfer){
            Toast.fire({
                icon: 'error',
                title: 'Invalid phone number please try again.'
            })
        }
        if(moneyTransfer == '' || isNaN(moneyTransfer)===true){
            Toast.fire({
                icon: 'error',
                title: 'Please enter your money transfer.'
            })
        }
        if(feeTransfer == undefined || feeTransfer == ''){
            Toast.fire({
                icon: 'error',
                title: 'Please choose a fee payer.'
            })
        }
        if(phonRecipient=== phoneTransfer && moneyTransfer != '' && isNaN(moneyTransfer)===false && feeTransfer != undefined && feeTransfer != ''){
            $.ajax({
                url: '/user/sendOTP',
                type: 'POST',
                data: {
                    phone: phonRecipient,
                    money: moneyTransfer,
                    feeTransfer:feeTransfer
                }
            }).then(data=>{
                if(data.success === true){
                    Toast.fire({
                        icon: 'success',
                        title: data.message
                    })
                    $('.verify_otp_transfer').append(`<div class="form_group">
                    <label for="otp_tf">Verify OTP</label>
                    <input id="otp_tf" type="text" placeholder="Enter your cvv code"/>
                    <button id="btnTransfer">Transfer</button>
                    </div>`)
                    $('#phone_transfer').attr('readonly', true)
                    $('#amount_transfer').attr('readonly', true)
                    $('#note_transfer').attr('readonly', true)
                    $('#sendOTPVerify').hide()
                    $('#btnTransfer').click(function(){
                        let otp = $('#otp_tf').val()
                        $.ajax({
                            url: '/user/transfer',
                            type: 'POST',
                            data:{
                                phonRecipient:phonRecipient,
                                moneyTransfer:moneyTransfer,
                                noteTransfer:noteTransfer,
                                feeTransfer:feeTransfer,
                                OTP: otp
                            }
                        }).then(data=>{
                            $('#btnTransfer').hide()
                            if(data.success === true){
                                // Send data socket io
                                socket.emit("Notification-transfer", data.data)
                                Toast.fire({
                                    icon: 'success',
                                    title: data.message
                                })
                                setTimeout(function(){
                                    window.location.reload()
                                }, 5000)
                            }else{
                                Toast.fire({
                                    icon: 'error',
                                    title: data.message,
                                })
                                setTimeout(function(){
                                    window.location.reload()
                                }, 5000)
                            }
                        }).catch(err =>{
                            console.log(err)
                        })
                    })
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: data.message
                    })
                }
            }).catch(err =>{
                console.log(err)
            })
        }
    })
})
// Socket notification transfer
socket.on('Notification-transfer', (data)=>{
    Toast.fire({
        icon: 'success',
        title: data.textTitle
    })
})
// Socker notification notice 
$(document).ready(function(){
    $('#selectHistory').change(function(){
        let selectHistory = this.value
        if(selectHistory){
            $.ajax({
                url: '/user/history',
                type: 'GET',
                data: {
                    selectHistory: selectHistory
                }
            }).then(result =>{
                $('#contentTable').empty()
                let tablehtml = ''
                let tr = ''
                let noTd, typeTransactionTd, moneyTd, timeCreate,statusTransactionTd, moreTd
                result.data.forEach((value, key) => {
                    noTd = `<td data-label="No">${key}</td>`
                    if(value.typeTransaction===0){
                        typeTransactionTd = `<td data-label="Transaction type">Top up</td>`
                    }else if(value.typeTransaction === 1){
                        typeTransactionTd = `<td data-label="Transaction type">Transfer</td>`
                    }else if(value.typeTransaction === 2){
                        typeTransactionTd = `<td data-label="Transaction type">Withdraw</td>`
                    }else if(value.typeTransaction === 3){
                        typeTransactionTd = `<td data-label="Transaction type">Buy Card</td>`
                    }else if(value.typeTransaction === 4){
                        typeTransactionTd = `<td data-label="Transaction type">Get Money</td>`
                    }else{
                        typeTransactionTd = `<td data-label="Transaction type">Get Money</td>`
                    }
                    moneyTd = `<td data-label="Money">${value.money}</td>`
                    timeCreate = ` <td data-label="Timestamp">${value.timeCreate}</td>`
                    if(value.statusTransaction === 0){
                        statusTransactionTd=`<td data-label="Status">                               <span class="status_history_sucess">Success</span></td>`
                    }else if(value.statusTransaction === 1){
                        statusTransactionTd=`<td data-label="Status">                               <span class="status_history_fail">Fail</span></td>`
                    }else{
                        statusTransactionTd=`<td data-label="Status">                               <span class="status_history_wait">Wait</span></td>`
                    }
                    moreTd = `<td data-label="More" data-id="${value._id}">Details</td>`
                    tr= `<tr>${noTd+typeTransactionTd+moneyTd+timeCreate+statusTransactionTd+moreTd}</tr>`
                    tablehtml+=tr
                })
                $('#contentTable').append(tablehtml)
                $("td[data-id]" ).click(function() {
                    let id = $(this).attr('data-id')
                    $.ajax({
                         url: `/user/history/${id}`,
                         type: 'GET',
                    }).then(result=>{
                         if(result.success===true){
                             let typeTransactionSp, statusTransactionSp, moneySp, timeSp, divModal
                             if(result.data.typeTransaction=== 0){
                                 typeTransactionSp = `<span>Type Transaction: Top up </span>`
                             }else if(result.data.typeTransaction === 1){
                                 typeTransactionSp = `<span>Type Transaction: Transfer </span>`
                             }else if(result.data.typeTransaction === 2){
                                 typeTransactionSp = `<span>Type Transaction: Withdraw </span>`
                             }else if(result.data.typeTransaction === 3){
                                 typeTransactionSp = `<span>Type Transaction: Buy Card </span>`
                             }else{
                                 typeTransactionSp = `<span>Type Transaction: Get Money </span>`
                             }  
                             if(result.data.statusTransaction === 0){
                                 statusTransactionSp = `<span>Status Transaction: Success </span>`
                             }else if(result.data.statusTransaction ===1){
                                 statusTransactionSp = `<span>Status Transaction: Fail </span>`
                             }else{
                                 statusTransactionSp = `<span>Status Transaction: Wait </span>`
                             }
                             moneySp = `<span>Money: ${result.data.money}đ</span>`
                             timeSp = ` <span>Time: ${result.data.timeCreate}</span>`
                             divModal = `
                             <div class="modal">
                                 <h4>Detail transaction </h4>
                                 ${typeTransactionSp+statusTransactionSp+moneySp+timeSp}
                                 <button id="btnCloseDetailHistory">Close</button>
                             </div>`
                             $('#modalHistory').css('display','flex')
                             $('.bodyHistory').css('overflow','hidden')
                             $('#modalHistory').append(divModal)
                             $('#btnCloseDetailHistory').click(function(){
                                 console.log('click')
                                 $('#modalHistory').empty()
                                 $('#modalHistory').css('display', 'none')
                                 $('.bodyHistory').css('overflow','auto')
                             })
                         }
                    }).catch(err =>{
                         console.log(err)
                    })
                 })
            }).catch(err =>{
                console.log(err)
            })
        }
    })
})
// Show detail history
$(document).ready(function(){
    $("td[data-id]" ).click(function() {
       let id = $(this).attr('data-id')
       $.ajax({
            url: `/user/history/${id}`,
            type: 'GET',
       }).then(result=>{
            if(result.success===true){
                let typeTransactionSp, statusTransactionSp, moneySp, timeSp, divModal
                if(result.data.typeTransaction=== 0){
                    typeTransactionSp = `<span>Type Transaction: Top up </span>`
                }else if(result.data.typeTransaction === 1){
                    typeTransactionSp = `<span>Type Transaction: Transfer </span>`
                }else if(result.data.typeTransaction === 2){
                    typeTransactionSp = `<span>Type Transaction: Withdraw </span>`
                }else if(result.data.typeTransaction === 3){
                    typeTransactionSp = `<span>Type Transaction: Buy Card </span>`
                }else{
                    typeTransactionSp = `<span>Type Transaction: Get Money </span>`
                }  
                if(result.data.statusTransaction === 0){
                    statusTransactionSp = `<span>Status Transaction: Success </span>`
                }else if(result.data.statusTransaction ===1){
                    statusTransactionSp = `<span>Status Transaction: Fail </span>`
                }else{
                    statusTransactionSp = `<span>Status Transaction: Wait </span>`
                }
                moneySp = `<span>Money: ${result.data.money}đ</span>`
                timeSp = ` <span>Time: ${result.data.timeCreate}</span>`
                divModal = `
                <div class="modal">
                    <h4>Detail transaction </h4>
                    ${typeTransactionSp+statusTransactionSp+moneySp+timeSp}
                    <button id="btnCloseDetailHistory">Close</button>
                </div>`
                $('#modalHistory').css('display','flex')
                $('.bodyHistory').css('overflow','hidden')
                $('#modalHistory').append(divModal)
                $('#btnCloseDetailHistory').click(function(){
                    console.log('click')
                    $('#modalHistory').empty()
                    $('#modalHistory').css('display', 'none')
                    $('.bodyHistory').css('overflow','auto')
                })
            }
       }).catch(err =>{
            console.log(err)
       })
    })
})

//Post notification by admin
$(document).ready(function(){
    $('#btnPostNoti').click(function(){
        let titleNoti = $('#post_noti_title').val()
        let descNoti = $('#post_noti_desc').val()
        if(titleNoti == ''){
            $('.span_error').html('Please enter your card number.')
        }
        if(descNoti == ''){
            $('.span_error').html('Please enter your expiry date.')
        }
        if(titleNoti != '' && descNoti != ''){
            $('.span_error').html('')
            $.ajax({
                url: '/admin/posts',
                type: 'POST',
                data: {
                    title: titleNoti,
                    description: descNoti
                }
            }).then(data =>{
                if(data.success === true){
                    $('#post_noti_title').val('')
                    $('#post_noti_desc').val('')
                    socket.emit("Send-Notification", data.data)
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 5000
                    })
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 5000
                    })
                }
            }).catch(err =>{
                console.log(err)
            })
           
        }

    })
})
// Socket notification send notice to user online
socket.on('Send-Notification', (data)=>{
    Toast.fire({
        icon: 'success',
        title: data.title
    })
})
