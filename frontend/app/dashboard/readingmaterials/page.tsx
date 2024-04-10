'use client'
import React from 'react';
import Main from '../main/Main';
import ReadingMaterials from '../readingmaterials';
const Page=()=>{

    return (
        <Main>
        <div className="w-full  flex flex-col justify-around  items-center mt-10">
            <ReadingMaterials/>
        </div>
        </Main>

    );
}
export default Page;