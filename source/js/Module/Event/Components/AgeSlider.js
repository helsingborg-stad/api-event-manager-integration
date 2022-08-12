import { parse } from "uuid";

const sliderFunc = () => {
    const parent = document.querySelector('.age-slider')

    if(!parent) {
        return;
    }

    const rangeS = parent.querySelectorAll('input[type="range"]'), 
        numberS = parent.querySelectorAll('input[type="number"]');

    rangeS.forEach((el) => {
        el.oninput = () => {
            let slide1 = parseFloat(rangeS[0].value), slide2 = parseFloat(rangeS[1].value);

            if (slide1 > slide2) {
                [slide1, slide2] = [slide2, slide1]
            }

            numberS[0].value = slide1;
            numberS[1].value = slide2;
        }
    });

    numberS.forEach((el) => {
        el.oninput = () => {
            let number1 = parseFloat(numberS[0].value), number2 = parseFloat(numberS[1].value);

            if (number1 > number2) {
                let tmp = number1;
                numberS[0].value = number2;
                numberS[1].value = tmp
            }

            rangeS[0].value = number1;
            rangeS[1].value = number2;
        };
    })

};

export default function AgeSlider ( { translation } ) {

    sliderFunc();
    

    return (
        <div className="age-slider-container">
            <p className="title"> {translation.selectAge} </p>

            <div className="age-slider">
            <span>min <input type="number" defaultValue="1" min="1" max="100" step="1" /> max <input type="number" defaultValue="100" min="1" max="100" step="1" /></span>


            <input defaultValue="1" min="1" max="100" step="1" type="range" />
            <input defaultValue="100" min="1" max="100" step="1" type="range" />

            </div>
        </div>

    )
}