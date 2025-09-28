// Helper utilities: fetch JSON with fallback to inline data
async function fetchJSON(path, fallback){
try{
const res = await fetch(path);
if(!res.ok) throw new Error('Network error');
return await res.json();
}catch(e){
console.warn('Using fallback for', path, e);
return fallback;
}
}


// Download helper
function downloadFile(filename, content, mime){
const blob = new Blob([content], {type: mime || 'application/octet-stream'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
setTimeout(()=>URL.revokeObjectURL(url),1000);
}


// Convert JSON array to CSV (simple)
function jsonToCSV(items){
if(!items || !items.length) return '';
const esc = (v) => `"${(''+v).replace(/"/g,'""')}"`;
const header = Object.keys(items[0]).map(esc).join(',');
const rows = items.map(r => Object.values(r).map(esc).join(','));
return [header, ...rows].join('\n');
}
// Export JSON array to CSV file
function exportToCSV(filename, items){
const csv = jsonToCSV(items);
downloadFile(filename, csv, 'text/csv');
}
// Export JSON array to JSON file
function exportToJSON(filename, items){
const json = JSON.stringify(items, null, 2);
downloadFile(filename, json, 'application/json');
}
// Simple date formatting
function formatDate(d){
if(!(d instanceof Date)) d = new Date(d);
return d.toISOString().split('T')[0];
}
// Simple time formatting
function formatTime(d){
if(!(d instanceof Date)) d = new Date(d);
return d.toTimeString().split(' ')[0];
}
// Simple date+time formatting
function formatDateTime(d){
if(!(d instanceof Date)) d = new Date(d);
return d.toISOString().replace('T',' ').split('.')[0];
}   
// Simple number formatting
function formatNumber(n, decimals=2){
return Number(n).toFixed(decimals);
}
// Simple currency formatting
function formatCurrency(n, currency='USD', decimals=2){
return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: decimals }).format(n);
}
// Simple percentage formatting
function formatPercentage(n, decimals=2){
return `${(n*100).toFixed(decimals)}%`;
} 
// Simple byte formatting
function formatBytes(n){
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];  
if (n === 0) return '0 Byte';
const i = parseInt(Math.floor(Math.log(n) / Math.log(1024)), 10);
return `${(n / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
}
// Simple duration formatting (seconds to H:M:S)
function formatDuration(seconds){
const h = Math.floor(seconds / 3600);
const m = Math.floor((seconds % 3600) / 60);
const s = Math.floor(seconds % 60);
return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}
// Simple string truncation
function truncateString(str, maxLength=100){
if(str.length <= maxLength) return str;
return str.slice(0, maxLength-3) + '...';
}
// Simple string capitalization
function capitalizeString(str){
return str.charAt(0).toUpperCase() + str.slice(1);
}
// Simple string title case
function titleCaseString(str){
return str.split(' ').map(capitalizeString).join(' ');
}
// Simple string slugify
function slugifyString(str){
return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
// Simple string to camelCase
function toCamelCase(str){
return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
// Simple debounce function
function debounce(func, wait){
let timeout;  
return function(...args){
clearTimeout(timeout);
timeout = setTimeout(() => func.apply(this, args), wait);
} 
}