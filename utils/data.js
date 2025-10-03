let property_types = ['Apartment','Plot', 'Villa','Condos','Family','Single Room']
let property_status_arr = ['Ready To Move','Mid Stage Construction','Under Construction','New Launch']
let publish_status_arr = ['Unpublished','Published']
let status=['open','closed','lost']
let agentStatus=['Active','Inactive']
let construction_year=[2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026]
let prop_for=['Rent','Sale','Both']
let time=["09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM",]
let agentfees=5000

let pages=5
BASE_URL = "192.168.103.15:3000"; 
const data={
    property_types,property_status_arr,publish_status_arr,status,agentStatus,construction_year,prop_for,time,agentfees,pages,BASE_URL
}



export default data;