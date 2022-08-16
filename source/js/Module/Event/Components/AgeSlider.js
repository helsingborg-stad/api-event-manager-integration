import { Dropdown } from '@helsingborg-stad/hbg-react';


// Frontend logic to sync numbers with slides
const sliderFunc = () => {
    const parent = document.querySelector('.age-slider')

    if(!parent) {
        return;
    }

    const rangeS = parent.querySelectorAll('input[type="range"]'), 
        numberS = parent.querySelectorAll('input[type="number"]');

    rangeS.forEach((el) => {
        el.oninput = () => {
            let slide1 = parseInt(rangeS[0].value), slide2 = parseInt(rangeS[1].value);
            if (slide1 > slide2) {
                [slide1, slide2] = [slide2, slide1]
            }
            numberS[0].value = slide1;
            numberS[1].value = slide2;
        }
    });

    numberS.forEach((el) => {
        el.oninput = () => {
            let number1 = parseInt(numberS[0].value), number2 = parseInt(numberS[1].value);
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

export default function AgeSlider ( { translation, ageRange, } ) {
    sliderFunc();
    
    const onSlide = () => {
        let minValue = parseInt(document.getElementById("minValue").value);
        let maxValue = parseInt(document.getElementById("maxValue").value);
        
        if (minValue > maxValue) {
            [minValue, maxValue] = [maxValue, minValue];
        }
        
        for (let i = 0; i < ageRange.length; i++) {
            if (i >= (minValue - 1) && i < maxValue) {
                ageRange[i].checked = true;
            }
            else {
                ageRange[i].checked = false;
            }
            // console.log(ageRange);
        }
    }
    
    return (
        <Dropdown title={translation.selectAge} className="age-slider-dropdown" >
            <div className="age-slider-container">
                <div className="age-slider">
                    <div className="min-max-age-input" >
                        <span>
                            min <input type="number" defaultValue="1" min="1" max="100" step="1" onChange={onSlide}/> 
                        </span>
                        <span>
                            max <input type="number" defaultValue="100" min="1" max="100" step="1" onChange={onSlide} />
                        </span>
                    </div>
                    <input id="minValue" defaultValue="1" min="1" max="100" step="1" type="range" onChange={onSlide} />
                    <input id="maxValue" defaultValue="100" min="1" max="100" step="1" type="range" onChange={onSlide} />
                </div>
            </div>
        </Dropdown>
    )
}