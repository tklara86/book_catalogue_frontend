class Msnry {
    constructor(params) {
        //params
        this.params = params ?? {};
        this.columns = this.params.columns ?? 4;
        this.parentEl = this.params.parentEL ?? document.querySelector('.msnry-container');
        this.filters = this.params.filters ?? false
        this.shuffle = this.params.shuffle ?? false
        this.elements = [...this.parentEl.children];
        // init Msnry
        this.initMsnry();
    }

    shuffleElements(array) {
        let currentIndex = array.length;
        let randomIndex;
      
        while (currentIndex > 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    generateLayout(numberOfCols, elements){    
        const container = this.parentEl;
        const elems = elements ?? this.elements;
        if (!container) return; 

        //remove old columns
        container.innerHTML = '';    
         
        let columns = [];

        for (let i=0;i<numberOfCols;i++) {
            columns[i] = document.createElement('div');
            columns[i].classList.add('msnry-column');
            container.appendChild(columns[i]);  
        }

        // randomize elements
        this.shuffle ? this.shuffleElements(elems) : null;

        for (let i=0;i<elems.length;i++) {
            const column = columns[i%numberOfCols];
            column.appendChild(elems[i]);
        }

  
        if (this.filters) {
            this.shuffleElements(elems);
            for (var i = 0; i < elems.length; i++) {
                let delay  = i / 20;
                elems[i].style.animation = `msnryShow .4s cubic-bezier( 0.79, 0.33, 0.34, 0.86 ) backwards ${delay}s`;
            }

        }
    }

    filtering() {
        const filters = document.querySelectorAll('.inp-cbx');
        if (!filters) return; 
        let filtersChecked = [];
        let items = [];
        filters.forEach(filter => {
            filter.addEventListener('change', () => {

                let index = filtersChecked.indexOf(filter.name);
                filter.checked ? filtersChecked.push(filter.name) : filtersChecked.splice(index, 1)
             
                items = [];
                let filteredNames = [];
                let postsArray = this.elements.slice();

                for (var i = 0; i < this.elements.length; i++) {
                    let filterValues = this.elements[i].dataset.filter.split(',');
                    filterValues.find(el => {
                        if (filtersChecked.indexOf(el) >= 0 && !filteredNames.includes(i)) {
                            filteredNames.push(i)     
                            items.push(postsArray[i]) 
                        }
                    })
                }

                if (filtersChecked.length == 0) items = this.elements.slice();

                this.generateLayout(this.columns, items)
            })
        })

   
    }

    initMsnry() {

        let previousScreenSize = window.innerWidth;
        window.addEventListener('resize', () => {
            if(window.innerWidth < 600 && previousScreenSize >= 600){
                this.generateLayout(2);
            }else if(window.innerWidth >= 600 && window.innerWidth < 1000 && (previousScreenSize < 600 || previousScreenSize >= 1000)){
                this.generateLayout(2);
        
            }else if(window.innerWidth >= 1000 && previousScreenSize < 1000){
                this.generateLayout(3)
            }
            previousScreenSize = window.innerWidth;
        
        })
        
        if(previousScreenSize < 600){
            this.generateLayout(2)
        }else if(previousScreenSize >= 600 && previousScreenSize < 1000){
            this.generateLayout(2)
        } else {
            this.generateLayout(this.columns)  
        }

        this.filtering();   
    
    }    
}



/**
 * params: (default: {})
 * columns: number of columns  (default: 4)
 * parentEl: parent element (default: .msnry-container)
 * filters: boolean (default: false)
 * shuffle: boolean (default: false)
 */
new Msnry({filters: true});






