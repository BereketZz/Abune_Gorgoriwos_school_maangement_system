import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AccessibilityOutline, FingerPrintOutline, SchoolOutline } from 'react-ionicons';

const CardAdmin = () => {

    const [userData, setUserData] = useState({ users: 0, schools: 0, students:0, teachers: 0 });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const teachersResponse = await axios.get('http://localhost:3333/auth/role/teacher');
          const studentsResponse = await axios.get('http://localhost:3333/auth/role/student');
          const adminsResponse = await axios.get('http://localhost:3333/auth/role/admin');
          const schoolsResponse = await axios.get('http://localhost:3333/schools/get');
          //const inactiveResponse = await axios.get('http://localhost:3333/auth/role/inactive');
  
          if (teachersResponse.status === 200 && studentsResponse.status === 200 && adminsResponse.status === 200 && schoolsResponse.status === 200) {
            const teachersCount = teachersResponse.data.length;
            const studentsCount = studentsResponse.data.length;
            const adminsCount = adminsResponse.data.length;
            const schoolsCount = schoolsResponse.data.length;
          //   const inactiveCount = inactiveResponse.data.length;
  
            setUserData({
              users: adminsCount,
              students: studentsCount,
              schools: schoolsCount,
              teachers: teachersCount,
            });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
    const featuresList = [
        {
          
          title:"Admin" ,
          amount:userData?.users
         
        },
        {
            title:"Schools" ,
            amount:userData?.schools

     
          
        },
        {
            title:"Teachers" ,
            amount:userData?.teachers
   
            
          },
        {
            title:"Students" ,
            amount:userData?.students

          
        },
      ];
  return (
    <div className=''>


           
          <div className="flex md:flex-row flex-col w-full items-center justify-center  md:gap-4 gap-4">
            {featuresList.map((feature) => {
              return (
                <div className="shadow-md p-6">
                <div className="">
                    <div className="flex flex-col">
                        <div className="flex space-x-8 w-80">
                            <div className="">
                                <div className="uppercase text-sm text-gray-400">
                                    {feature?.title}
                                </div>
                            <div className="mt-1">
                                    <div className="flex space-x-2 items-center">
                                        <div className="text-2xl">
                                            {feature?.amount}
                                        </div>
                                        <div className="text-xs text-green-800 bg-green-200 rounded-md p-1">
                                            +4.5%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <svg className="h-16 w-20 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>                                
                        </div>
                    </div>
                </div>
            </div>



         
              );
            })}
          </div> 
    
    </div>
  )
}

export default CardAdmin
