const key = 'dlrL9yb4V7MRqNWl99Zg3i7W82GmvlUq';

const getCity = async (city) => {

const base = 'http://dataservice.accuweather.com/locations/v1/cities/search';
const query = '?apikey=${key}&q=${city}';

const respone = await fetch(base + query);
const data = await response.json();

console.log(data);
}; 

getCity('copenhagen').then(data => console.log(data)); 


