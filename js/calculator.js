$(function(){
    //page fades in on load
    function pagefade() {
        var pge = document.getElementsByTagName("body")[0];
        pge.style.opacity = 1;
    }
    setTimeout(pagefade, 500);//page fadein duration
    var calc = document.getElementById('calcBttn');
    var Msg = document.getElementById('ageDisplayMsg'); //top msg shown after calculations
    var Msg2 = document.getElementById('lifeMsg'); // buttom msg shown after calculations

    // MAIN FUNCTION -- Calculate Age in years, months, days and display results 
    function calcAge(e1) {
        var raw, years, months, days, daysSameMonth;
        var today = new Date();
        var DOB = new Date(document.getElementById('dob').value);//retrieve DOB from calendar
        var difference = (today.getTime() - DOB.getTime());
        var NewMsg;
        raw = difference / 31556900000;//devided by miliseconds in a year
        years = Math.floor(raw);//round to years
        months = Math.floor((raw % years) * 12);//calculate months
        days = Math.floor((((raw % years) * 12) % months) * 30);//calculate days
        daysSameMonth = Math.floor((raw % years) * 12 * 30);//calculate days if dob in same month
        
        //if birthday recently passed (born in the same months as today) show only years and days
        if (months === 0 && daysSameMonth !== 0) {
            NewMsg = "You are " + years.toString() + " years and " +
            daysSameMonth.toString() + " day(s) old.";
            Msg.textContent = NewMsg;
        }
        //if born same day but different month show only years and months
        else if (days===0) {
            NewMsg = "You are " + years.toString() + " years and " + months.toString() + "months old.";
            Msg.textContent = NewMsg;
        } 
        //if today is the user's birthday show years + happy birthday msg
        else if (daysSameMonth === 0) {
            NewMsg = "Happy Birthday!" + " You are " + years.toString() +
            " years old today.";
            Msg.textContent = NewMsg;
        } 
        else {
            NewMsg = "You are " + years.toString() + " years, " + months.toString() +
            " month(s) and " + days.toString() + " day(s) old.";
            Msg.textContent = NewMsg;
        }
        return years; //return years for use in CalcLife() function
    }

// MAIN FUNCTION - calculate life lived, optimal life remaining, old age and display results in 3 bars
    function CalcLife(e) {
        var age = calcAge(); //use age calculated by calcAge function
        var male = document.getElementById('radioBttn1').checked;
        var female = document.getElementById('radioBttn2').checked;
        var regSelect = document.getElementById('region');
        var progressBar1 = document.getElementById('lifebar1');//first bar
        var progressBar2 = document.getElementById('lifebar2');//second bar
        var progressBar3 = document.getElementById('lifebar3');//third bar
        var progressTxt1 = document.getElementById('txt1');//percentage txt shown on bar 1
        var progressTxt2 = document.getElementById('txt2');//percentage txt shown on bar 2
        var progressTxt3 = document.getElementById('txt3');//percentage txt shown on bar 3
        var region = regSelect.options[regSelect.selectedIndex].value; //dropdown region menu
        var lifeExpectancy; //total life expectancy
        var effLifeRemaining; //the optimal life remaining (green bar) before old age kicks in

        //AFRICA - optimal life 45 years
        if (region === "Africa") {
            effLifeRemaining = 45 - age;
        } 
        //EASTERN MEDITERRANEAN - optimal life 55 years
        else if (region == "MedEast" || region == "SeAsia") {
            effLifeRemaining = 55 - age;
        } 
        //ALL OTHER REGIONS - Optimal life 60 years
        else {
            effLifeRemaining = 60 - age;
        }

        //generic calculate percentage function
        function getPercentage(a, b) {
            return Math.floor((a / b) * 100);
        }

        //Show all 3 bars including the txts showing percentages
        function ShowBars() {
            var lifeRemaining = 100 - (getPercentage(age, lifeExpectancy) +
                getPercentage(effLifeRemaining, lifeExpectancy));

            //show bar 1 (green) - use callbacks to stop synchrnous filling of bars
            function ShowBar1(callback) {
                var x1 = 0;
                var y1;
                progressBar2.setAttribute("style", "width: 0%");
                progressBar3.setAttribute("style", "width: 0%");
                //use SetInterval to fill bar
                var test = setInterval(function() {
                    x1 += 1;
                    y1 = "width: " + x1.toString() + "%";
                    progressBar1.setAttribute("style", y1);
                    progressTxt1.textContent = x1.toString() +
                    "%";//show percentage
                    if (x1 === getPercentage(age,
                        lifeExpectancy)) {
                            clearInterval(test);//bar stops filling
                            callback();
                        }
                }, 50);//fill bar in 50 ms
            }
            //show bar 2 then show bar 3, utilise setInterval and callbacks
            function ShowBar2() {
                var x2 = 0;
                var y2;
                var test2 = setInterval(function() {
                    x2 += 1;
                    y2 = "width: " + x2.toString() + "%";
                    progressBar2.setAttribute("style", y2);
                    progressTxt2.textContent = x2.toString() +
                    "%";
                    if (x2 === getPercentage(effLifeRemaining,
                        lifeExpectancy)) {
                            clearInterval(test2);
                            var x3 = 0;
                            var y3;
                            var test3 = setInterval(function() {
                                x3 += 1;
                                y3 = "width: " + x3.toString() +"%";
                                progressBar3.setAttribute("style", y3);
                                progressTxt3.textContent =
                                x3.toString() + "%";
                                if (x3 == lifeRemaining) {
                                    clearInterval(test3);
                                }
                            }, 50);
                        }
                }, 50);
            }
            ShowBar1(ShowBar2); //callback - show bar 2 after bar 1
        }
        //life expectancy data for regions, for men and women
        var Africa = [57, 60]; //men in africa life expectancy 57, women 60
        var Europe = [73, 80];
        var Americas = [74, 80];
        var SeAsia = [66, 70];
        var WPacific = [74, 78];
        var MedEast = [67, 70];
        var US = [76, 81];
        var ANZ = [80, 85];
        var Japan = [80, 87];
        var Korea = [78, 85];

        //function to display information in lifeMsg area
        function displayInfo(info, region, sex) {
            this.info = info;
            this.sex = sex;
            this.region = region;
            Msg2.style.opacity = 1;
            Msg2.textContent = "The life expectancy in your region " + " (" +
                region + ") is " + info.toString() + " years for " + sex.toString() +
        ". The red bar shows life lived and the green bar shows the precentage of your life remaining before you get old (orange bar).";
        }

        //if 'male' selected
        if (male) {
            //switch statement for dropdown 'region' menu
            switch (region) {
                case "US":
                lifeExpectancy = US[0];
                ShowBars();//Display bars using US[0] array data (life expectancy for men)
                displayInfo(lifeExpectancy, 'US', 'Men');
                break;
                case "Europe":
                lifeExpectancy = Europe[0];
                ShowBars();
                displayInfo(lifeExpectancy, 'Europe', 'Men');//run displayInfo with inputs
                break;
                case "Americas":
                lifeExpectancy = Americas[0];
                ShowBars();
                displayInfo(lifeExpectancy, 'Americas', 'Men');
                break;
                case "Africa":
                lifeExpectancy = Africa[0];
                ShowBars();
                displayInfo(lifeExpectancy, 'Africa', 'Men');
                break;
                case "Japan":
                lifeExpectancy = Japan[0];
                ShowBars();
                displayInfo(lifeExpectancy, 'Japan', 'Men');
                break;
                case "ANZ":
                lifeExpectancy = ANZ[0];
                ShowBars();
                displayInfo(lifeExpectancy, 'Australia/NZ', 'Men');
                break;
                case "Korea":
                lifeExpectancy = Korea[0];
                ShowBars();
                displayInfo(lifeExpectancy, 'Korea', 'Men');
                break;
                case "Pacific":
                lifeExpectancy = WPacific[0];
                ShowBars();
                displayInfo(lifeExpectancy, 'Pacific', 'Men');
                break;
                case "SeAsia":
                lifeExpectancy = SeAsia[0];
                ShowBars();
                displayInfo(lifeExpectancy, 'SE Asia', 'Men');
                break;
                case "MedEast":
                lifeExpectancy = MedEast[0];
                ShowBars();
                displayInfo(lifeExpectancy, 'Eastern Mediterranean', 'Men');
                break;
            }
        } 

        //for females
        else if (female) {
            switch (region) {
                case "US":
                lifeExpectancy = US[1];
                ShowBars();
                displayInfo(lifeExpectancy, 'US', 'Women');
                break;
                case "Europe":
                lifeExpectancy = Europe[1];
                ShowBars();
                displayInfo(lifeExpectancy, 'Europe', 'Women');
                break;
                case "Americas":
                lifeExpectancy = Americas[1];
                ShowBars();
                displayInfo(lifeExpectancy, 'Americas', 'Women');
                break;
                case "Africa":
                lifeExpectancy = Africa[1];
                ShowBars();
                displayInfo(lifeExpectancy, 'Africa', 'Women');
                break;
                case "Japan":
                lifeExpectancy = Japan[1];
                ShowBars();
                displayInfo(lifeExpectancy, 'Japan', 'Women');
                break;
                case "ANZ":
                lifeExpectancy = ANZ[1];
                ShowBars();
                displayInfo(lifeExpectancy, 'Australia/NZ', 'Women');
                break;
                case "Korea":
                lifeExpectancy = Korea[1];
                ShowBars();
                displayInfo(lifeExpectancy, 'Korea', 'Women');
                break;
                case "Pacific":
                lifeExpectancy = WPacific[1];
                ShowBars();
                displayInfo(lifeExpectancy, 'Pacific', 'Women');
                break;
                case "SeAsia":
                lifeExpectancy = SeAsia[1];
                ShowBars();
                displayInfo(lifeExpectancy, 'SE Asia', 'Women');
                break;
                case "MedEast":
                lifeExpectancy = MedEast[1];
                ShowBars();
                displayInfo(lifeExpectancy, 'Eastern Mediterranean',
                    'Women');
                break;
            }
        }
    }    
    calc.addEventListener('click', function(e) {
        var DOB = new Date(document.getElementById('dob').value);
        var age = calcAge();

        //Error handling - max age set at 40
        if (isNaN(DOB) || age>40 || age<5){
            Msg.textContent="Please choose a valid date of birth from the date picker";
            Msg2.textContent="";
        }
        else {
            var calcBtn = document.getElementById("calcBttn");
            //go to life bar and show results
            $('body').animate({
                scrollTop: $("#life-bar").offset().top
            },1000);
            //disable button while showing bars        
            $(calcBtn).removeClass("btn btn-custom");
            $(calcBtn).addClass("btn-custom-disbaled").prop('disabled', true); 
            calcBtn.setAttribute("value", "Calculating...");
            //run main functions
            calcAge(e);
            CalcLife(e);

            //wait 5 seconds for bars to show and re-enable the calculate button
            setTimeout(function() {
                $(calcBtn).removeClass("btn-custom-disbaled");
                $(calcBtn).addClass("btn btn-custom").prop('disabled', false);
                calcBtn.setAttribute("value", "Calculate");
            }, 5000);
        }
    }, false);
}());