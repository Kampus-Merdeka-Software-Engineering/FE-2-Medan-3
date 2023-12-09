const phoneInputField = document.querySelector("#phone_number");
    const phoneInput = window.intlTelInput(phoneInputField, { utilsScript:
            "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

const navbarIcon = document.getElementById("navbar-icon");
const navbarList = document.getElementById("navbar-list");

navbarIcon.addEventListener("click", ()=> {
    navbarList.classList.toggle("hidden");
});


$(document).on("ready",function(){
    // initiate
    const collectCity = document.querySelector("#collectCity");
    const collectDestination = document.querySelector("#collectDestination");
    const collectTransportation = document.querySelector(".booking-choose");
    const reviewSection = document.querySelector(".rv-card");
    const bookingSection = document.querySelector(".check-booking-card");
    const formBooking = document.querySelector("#booking-form-travel");
    const nameInput = document.querySelector("#name");
    const phoneInput = document.querySelector("#phone_number");
    const passangerInput = document.querySelector("#passanger");
    const dateInput = document.querySelector("#date");
    const formContactUs = document.querySelector("#contact-us-form");
    const yourName = document.querySelector("#yourName");
    const yourEmail = document.querySelector("#yourEmail");
    const yourMessage = document.querySelector("#yourMessage");

    formContactUs.addEventListener("submit", function(e){
        e.preventDefault();
        
        const formDataContactUs = {
            name: yourName.value,
            email: yourEmail.value,
            message: yourMessage.value,
        } 
        
        fetch("https://be-2-medan-3-production.up.railway.app/contactus", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataContactUs),
        })
        .then(response => response.json())
        .then(data => {alert(data.message); getReviewers();})
        .catch(error => {
            console.log(error);
        })
    })
    function checkError(el, message){
        const id = el.getAttribute('id');
        const validateInput = document.querySelector(`#${id}`)
        const parentInput = validateInput.parentElement;
        const messageEl = document.querySelector(`#${id} + .text-error`);
        validateInput.classList.add('error-input');
        if(messageEl == null){
            const createErr = document.createElement('span');
            createErr.classList.add('text-error');
            createErr.classList.add('show');
            createErr.textContent = message;
            parentInput.appendChild(createErr);
        }
        messageEl.classList.add('show');
        messageEl.textContent = message;
    }

    function resetError(el){
        const idInput = el.getAttribute('id');
        const inputEl = document.querySelector(`#${idInput}`);
        const messageEl = document.querySelector(`#${idInput} + .text-error`);
        if(inputEl.classList.contains('error-input')){
            inputEl.classList.remove('error-input');
        }
        if(messageEl != null){
            messageEl.classList.remove('show');
            messageEl.textContent = "";
        }
    }

    formBooking.addEventListener("submit",function(e){
        e.preventDefault();
        try {
            const transportationId = document.getElementsByName("TransportationId");
    
            let selectedTransportation;
            for(const radioButton of transportationId){
                if(radioButton.checked){
                    selectedTransportation= radioButton.value;
                }
            }
    
            const formData = {
                name: nameInput.value,
                phone_number: phoneInput.value,
                CityId: collectCity.value,
                DestinationId: collectDestination.value,
                TransportationId: selectedTransportation,
                DateDeparture: dateInput.value,
                Passanger: passangerInput.value
            }
    
    
            fetch("https://be-2-medan-3-production.up.railway.app/bookings", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                
            })
            .then(response => response.json())
            .then(data => {alert(data.message); getBookings();})
            .then(response => { 
                const attributes = ['name', 'phone_number'];
                attributes.map((attr) => resetError(document.querySelector(`#${attr}`)));
                if(response.code === 422){
                    response.errors.map((error) =>{ checkError(document.querySelector(`#${error.field}`),error.message)})
                } else if(response.code === 404){
                    alert(response.message);
                }else{
                    attributes.map((attr) => resetError(document.querySelector(`#${attr}`)))
                }
                getBookings();
            })
            .catch(error => {
                console.log(error);
            })
        } catch (error) {
            console.log(error);
        }

    })
    
    setTimeout(() => {
        $("#loader").fadeOut("slow",function(){
            $("#afterLoad").css("display","block");
            AOS.init();
        });
    }, 1000);


    getBookings();
    collectCities();
    getReviewers();
    
    collectCity.addEventListener("change",async function(){
        try {
            const cityValue = this.value;
            const destinations = await getAllDestinationsById(cityValue);
            collectDestination.removeAttribute("disabled");
            updateUiDestinastions(destinations);
        } catch (error) {
            alert(error)
        }
    });

    collectDestination.addEventListener("change",async function(){
        try {
            const destinationValue = this.value;
            const transportation = await getAllTransportationByDestinationId(destinationValue);
            updateUiTransportation(transportation);
        } catch (error) {
            alert(error)
        }
    });

    function getAllTransportationByDestinationId(destination) {
        return fetch(`https://be-2-medan-3-production.up.railway.app/transportations/${destination}`)
        .then((response) => {
            return response.json();
        }).then((response)=>{
            return Promise.resolve(response.data);
        })
        .catch((response)=> {
            return Promise.reject(response.message);
        });
    }

    function getAllDestinationsById(city) {
        return fetch(`https://be-2-medan-3-production.up.railway.app/destinations/${city}`)
        .then((response) => {
            return response.json();
        }).then((response)=>{
            return Promise.resolve(response.data);
        })
        .catch((response)=> {
            return Promise.reject(response.message);
        });
    }

    async function collectCities(){
        try {
            const cities = await getAllCities();
            updateUiCities(cities);
        } catch (error) {
            alert(error.message);
        }
    }

    async function getBookings(){
        try {
            const bookings = await getAllBookings();
            updateUiBookings(bookings);
        } catch (error) {
            alert(error.message);
        }
    }

    function getAllCities(){
        return fetch(`https://be-2-medan-3-production.up.railway.app/cities`)
        .then((response) => {
            return response.json();
        }).then((response)=>{
            return Promise.resolve(response.data);
        })
        .catch((err)=> {
            return Promise.reject(err.message);
        });
    }
    
    function getAllBookings(){
        return fetch(`https://be-2-medan-3-production.up.railway.app/bookings`)
        .then((response) => {
            return response.json();
        }).then((response)=>{
            return Promise.resolve(response.data);
        })
        .catch((err)=> {
            return Promise.reject(err.message);
        });
    }

    function getAllCities(){
        return fetch(`https://be-2-medan-3-production.up.railway.app/cities`)
        .then((response) => {
            return response.json();
        }).then((response)=>{
            return Promise.resolve(response.data);
        })
        .catch((err)=> {
            return Promise.reject(err.message);
        });
    }

    function updateUiCities(cities) {
        let optionCity = `<option disabled selected>Choose City</option>`;
        cities.map((city) => optionCity += showListCity(city));
        
        collectCity.innerHTML = optionCity;
    }

    function updateUiDestinastions(destinations) {
        let optionDestinations = ``;
        destinations.map((destination) => optionDestinations += showListDestination(destination));
        collectDestination.innerHTML = `<option disabled selected>Choose Destination</option>`
        collectDestination.innerHTML += optionDestinations;
    }
    
    function updateUiTransportation(transportations) {
        let optionTransportations = ``;
        transportations.map((transportation) => optionTransportations += showListTransportation(transportation));
        collectTransportation.innerHTML = ``;
        collectTransportation.innerHTML += optionTransportations;
    }

    function updateUiBookings(bookings) {
        let bookingCard = ``;
        bookings.map((booking) => bookingCard += showListBooking(booking));
        bookingSection.innerHTML = ``;
        bookingSection.innerHTML += bookingCard;
    }

    function updateUiReviewers(reviews) {
        let reviewerCard = ``;
        reviews.map((review) => reviewerCard += showListReview(review));
        reviewSection.innerHTML = "";
        reviewSection.innerHTML += reviewerCard;
    }

    function showListBooking(booking) {
        return `<div class="cb-card1" data-aos="flip-left" data-aos-duration="1000">
        <table>
            <tr>
                <td><b>Nomor Booking</b></td>
                <td>:</td>
                <td>${booking.id}</td>
            </tr>
            <tr>
                <td><b>Nama Panggilan</b></td>
                <td>:</td>
                <td>${booking.name}</td>
            </tr>
            <tr>
                <td><b>Phone Number</b></td>
                <td>:</td>
                <td>${booking.phone_number}</td>
            </tr>
            <tr>
                <td><b>City</b></td>
                <td>:</td>
                <td>${booking.City.name}</td>
            </tr>
            <tr>
                <td><b>Date</b></td>
                <td>:</td>
                <td>${booking.DateDeparture}</td>
            </tr>
            <tr>
                <td><b>Destination</b></td>
                <td>:</td>
                <td>${booking.Destination.name}</td>
            </tr>
            <tr>
                <td><b>Passanger</b></td>
                <td>:</td>
                <td>${booking.Passanger} People</td>
            </tr>
            <tr>
                <td><b>Transportation</b></td>
                <td>:</td>
                <td>${booking.Transportation.types_of_transportation}</td>
            </tr>
        </table>
        
    </div>`;
    }
    
    function showListReview(review) {
        return `<div class="rv-card1" data-aos="flip-left" data-aos-duration="1000">
        <h2>${review.name}</h2>
        <h4>${review.email} </h4>
        <p>${review.message}</p>
        </div>`;
    }

    function showListCity(city) {
        return `<option value="${city.id}">${city.name}</option>`;
    }

    function showListDestination(destination) {
        return `<option value="${destination.id}">${destination.name}</option>`;
    }

    function showListTransportation(transportation) {
        return ` <input type="radio" name="TransportationId" id="mobil${transportation.Transportation.types_of_transportation}" value="${transportation.Transportation.id}" required>
        <label class="booking-c1" for="mobil${transportation.Transportation.types_of_transportation}">
            <img src="./assets/${transportation.Transportation.types_of_transportation}.png" alt="" width="50%">
            <h3>${transportation.Transportation.types_of_transportation}</h3>
        </label>`;

    }

    async function getReviewers(){
        try {
            const reviewers = await getAllReviewers();
            updateUiReviewers(reviewers);
        } catch (error) {
            alert(error.message);
        }
    }

    function getAllReviewers(){
        return fetch(`https://be-2-medan-3-production.up.railway.app/contactus`)
        .then((response) => {
            return response.json();
        }).then((response)=>{
            return Promise.resolve(response.data);
        })
        .catch((err)=> {
            return Promise.reject(err.message);
        });
    }
})

