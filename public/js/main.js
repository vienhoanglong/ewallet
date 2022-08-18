

let btnBarMobile = document.querySelector(".btn_bar_mobile")
let itemBarMobile = document.querySelector(".mobile_bar_item")
if(btnBarMobile){
    btnBarMobile.addEventListener('click', ()=>{
        let typeDisplay = itemBarMobile.style.display === "block" ? "none" : "block"
        itemBarMobile.style.display = typeDisplay
    })
}
let btnClickProfile = document.querySelector('#click_profile')
let menuProfile = document.querySelector('.menu')
let iconDropMenu = document.querySelector('#ic_dropmenu')
function getNameIcon(){
    let getNameIcon =  iconDropMenu.getAttribute('name') === "chevron-up-sharp"? "chevron-down-outline":"chevron-up-sharp"
    iconDropMenu.setAttribute("name", getNameIcon)
}
if(btnClickProfile){
    btnClickProfile.addEventListener('click', (e)=>{
        e.preventDefault()
        getNameIcon()
        menuProfile.classList.toggle("active")
    }, false) 
}
document.addEventListener('click', e =>{
    if(menuProfile){
        let checkMenuProfile = menuProfile.className ==="menu active" ? true : false
        if(!btnClickProfile.contains(e.target) && checkMenuProfile === true){
            getNameIcon()
            menuProfile.classList.remove("active")
        }
    }
})
// Quantity card input
let minus = document.querySelector('.minus')
let plus = document.querySelector('.plus')
let num_quantity = document.querySelector('.num_quantity')
if(minus){
    minus.addEventListener('click', ()=>{
        if(num_quantity.value > 1){
            num_quantity.value = +num_quantity.value - 1
        }
    })
}
if(plus){
    plus.addEventListener('click', ()=>{
        if(num_quantity.value < 5){
            num_quantity.value = +num_quantity.value + 1
        }
    })
}
// Toggle hide eye input change new password
let eyeNewPassword = document.querySelector('#eye_newpass')
let inputNewPasswod = document.querySelector('#newpass_change')
let eyeRePassword = document.querySelector('#eye_repass')
let inputRePassword = document.querySelector('#repass_change')
let eyeOldPasswordModal = document.querySelector('#eye_old')
let eyeNewPasswordModal = document.querySelector('#eye_new')
let eyeConfirmPasswordModal = document.querySelector('#eye_confirm')
let inputOldPasswordModal = document.querySelector('#password_old')
let inputNewPasswordModal = document.querySelector('#password_new')
let inputConfirmPasswordModal = document.querySelector('#password_confirm')
function getIconEye(contentIcon){
    let getNameIcon = contentIcon.getAttribute('name') === 'eye-sharp' ? 'eye-off-sharp' : 'eye-sharp'
    contentIcon.setAttribute('name', getNameIcon)
}
if(eyeNewPassword){
    eyeNewPassword.addEventListener('click', ()=>{
        let type = inputNewPasswod.getAttribute('type') === 'password' ? 'text' : 'password';
        inputNewPasswod.setAttribute('type', type);
        getIconEye(eyeNewPassword)
    })
}
if(eyeRePassword){
    eyeRePassword.addEventListener('click', ()=>{
        let type = inputRePassword.getAttribute('type') === 'password' ? 'text' : 'password';
        inputRePassword.setAttribute('type', type);
        getIconEye(eyeRePassword)
    })
}
if(eyeOldPasswordModal){
    eyeOldPasswordModal.addEventListener('click', ()=>{
        let type = inputOldPasswordModal.getAttribute('type') === 'password' ? 'text' : 'password';
        inputOldPasswordModal.setAttribute('type', type);
        getIconEye(eyeOldPasswordModal)
    })
}
if(eyeNewPasswordModal){
    eyeNewPasswordModal.addEventListener('click', ()=>{
        let type = inputNewPasswordModal.getAttribute('type') === 'password' ? 'text' : 'password';
        inputNewPasswordModal.setAttribute('type', type);
        getIconEye(eyeNewPasswordModal)
    })
}
if(eyeConfirmPasswordModal){
    eyeConfirmPasswordModal.addEventListener('click', ()=>{
        let type = inputConfirmPasswordModal.getAttribute('type') === 'password' ? 'text' : 'password';
        inputConfirmPasswordModal.setAttribute('type', type);
        getIconEye(eyeConfirmPasswordModal)
    })
}
// International flag phone number
const phoneInputField = document.querySelector("#phone_register");
if(phoneInputField){
    intlTelInput(phoneInputField, {
        utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.17/js/utils.js",
        initialCountry:"vn"
    });
}
// Change text file upload image (Front/Back CCCD)
let frontImgRegister = document.querySelector('#front_register')
let backImgRegister = document.querySelector('#back_register')
let fileNameFront = document.querySelector('.file_name_front')
let fileNameBack = document.querySelector('.file_name_back')
function getTextNameUploadFile(file, fileName){
    file.addEventListener('change', ()=>{
        let name = file.value.split('\\')
        name = name[name.length-1]
        fileName.textContent = name
    })
}
if(frontImgRegister){
   getTextNameUploadFile(frontImgRegister, fileNameFront)
}
if(backImgRegister){
    getTextNameUploadFile(backImgRegister, fileNameBack)
}
// Change Img Profile
const objImg = [
    {
        url: '/images/bg-3.png',
        desc: 'A website simulating an e-wallet serving two objects customers and administrators. Please provide complete personal information to use the wallet !!!'       
    },
    {
        url: '/images/bg-2.png',
        desc: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt architecto quod ratione sequi, odio et velit ex iusto. Facilis sunt excepturi ut, numquam quibusdam consequatur optio beatae recusandae alias magnam?'       
    },
    {
        url: '/images/bg-1.png',
        desc: 'Lorem,1123 quibusdam consequatur optio beatae recusandae alias magnam?'       
    }
]
const contentImg = document.querySelector('.content_img')
const desc = document.querySelector('#desc')
if(contentImg && desc){
    setInterval(()=>{
        autoPlay()
    }, 9000)
    const autoPlay = () =>{
        for (let index = 0; index < objImg.length; index++) {
            const element = objImg[index]
            setTimeout(()=>{
                contentImg.style.backgroundImage = `url('${element.url}')`
                
                desc.innerHTML = element.desc
            }, index*5000)
        }
    }
}
let modalPassword = document.querySelector('#modalPassword')
let btnCloseModal = document.querySelector('#btnCloseModal')
let modalUpload = document.querySelector('#modalUpload')
let btnCloseModalUpload = document.querySelector('#btnCloseModalUpload')
if(btnCloseModal && modalPassword){
    btnCloseModal.addEventListener('click', ()=>{
        modalPassword.style.display = 'none'
    })
}
let btnOpenChangePassword = document.querySelector('#btnOpenChangePassword')
let btnOpenUpload = document.querySelector('#btnOpenUpload')
if(btnOpenChangePassword){
    btnOpenChangePassword.addEventListener('click', ()=>{
        modalPassword.style.display = 'flex'
    })
}
if(modalUpload && btnCloseModalUpload){
    btnCloseModalUpload.addEventListener('click', ()=>{
        modalUpload.style.display = 'none'
    })
}
if(btnOpenUpload){
    btnOpenUpload.addEventListener('click', ()=>{
        modalUpload.style.display = 'flex'
    })
}
const readUrl = (input, image)=>{
    if(input.files && input.files[0]){
        var reader = new FileReader()
        reader.onload = function(e){
            var fileUrl = e.target.result
            image.setAttribute('src',fileUrl)
        }
        reader.readAsDataURL(input.files[0])
    }
}
let fileUpload = document.querySelector('#file_upload')
let imgUpload = document.querySelector('#img_upload')
let iconUpload = document.querySelector('#icon_upload')
if(fileUpload && imgUpload){
    fileUpload.addEventListener('change', ()=>{
        readUrl(fileUpload, imgUpload)
    })
}
if(iconUpload){
    iconUpload.addEventListener('click', ()=>{
        fileUpload.click()
    })
}