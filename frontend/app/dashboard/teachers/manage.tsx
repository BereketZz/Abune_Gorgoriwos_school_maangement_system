"use client";
import { Box, Card, Typography, gridClasses } from "@mui/material";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import UsersActions from "./UsersActions";
import { ToastContainer } from "react-toastify";
import { grey } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
function Manage() {
  const [teachers, setTeachers] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3333/teachers/get");
        setTeachers(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  function openDialog(user) {
    setSelectedUser(user);
    
    setIsOpen(true);
  }

  const filteredResult = teachers.filter(teacher => teacher.id === selectedUser);
  console.log(filteredResult[0]?.frist_name)

  function closeDialog() {
    setIsOpen(false);
  }
  function sendTo(id) {
    router.push(
    `/dashboard/teachup/${id}`,

    );
  }
 

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: "60" },
      {
        field: "frist_name",
        headerName: "First Name",
        width: "200",
        type: "string",
        editable: true,
      },
      { field: "middle_name", headerName: "Middle Name", width: "200" },
      { field: "last_name", headerName: "Last Name", width: "200" },
      { field: "email", headerName: "Email", width: "200" },
      { field: "phone", headerName: "phone", width: "200" },
      { field: "education_level", headerName: "Education Leve", width: "200" },
      {field:"grade", headerName:"Grade", width:'160',  }, 
      {field:"section", headerName:"Section", width:'160',type:'singleSelect', valueOptions:["section"]},
      {
        field: "view",
        headerName: "View",
        type: "actions",
        renderCell: (params) => (
          <button className="border-none bg-transparent w-full h-full" onClick={() => openDialog(params.id)}>
            <VisibilityIcon />
          </button>
        ),
      },
      {
        field: "edit",
        headerName: "Edit",
        type: "actions",
        renderCell: (params) => (
          <button
            className="border-none bg-transparent w-full h-full"
            onClick={() => sendTo(params.id)}>
            <EditIcon />
          </button>
        ),
      },
    ],

    [rowId]
  );

  return (
    <div className="w-full ml-4 flex justify-center items-center ">
      <div className=" w-[80%] mt-6">
        <DataGrid
          rows={teachers}
          getRowId={(row) => row.id}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 25, 50]}
          getRowSpacing={(params) => ({
            top: params.isFirstVisible ? 0 : 5,
            bottom: params.isLastVisible ? 0 : 5,
          })}
          sx={{
            [`& .${gridClasses.row}`]: {
              bgcolor: (theme) =>
                theme.palette.mode == "light" ? grey[200] : grey[900],
            },
          }}
          slots={{ toolbar: GridToolbar }}
          onCellKeyDown={(params) => setRowId(params.id)}
          onCellEditStart={(params) => setRowId(params.id)}>
          {" "}
        </DataGrid>
      </div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto "
          onClose={closeDialog}>
          <div className="flex items-center justify-center min-h-screen ">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className="bg-white rounded-lg p-6 w-[500px] mx-auto z-10 ">
                <Dialog.Title className="text-lg font-semibold mb-2">
                  User Information
                </Dialog.Title>
                {selectedUser && (
                  <div className="flex   space-x-4">
                    <div>
                      <AccountCircleIcon sx={{ fontSize: "60px" }} />
                    </div>
                    <div>
                      <p className="text-xl font-semibold">
                        {filteredResult[0]?.frist_name} {filteredResult[0]?.last_name}
                      </p>

                      <p className="text-gray-500">{filteredResult[0]?.email}</p>
                      <div className="flex gap-4  ">
                        <div className="mt-4 ">
                          <label
                            htmlFor="grade"
                            className="block font-medium text-gray-700">
                            Allocated Grade
                          </label>
                          <select
                            id="grade"
                            name="grade"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            value={filteredResult[0]?.grade[0]} // Assuming the first grade is selected
                          >
                            {filteredResult[0]?.grade.map((grade, index) => (
                              <option key={index} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-4 ">
                          <label
                            htmlFor="section"
                            className="block font-medium text-gray-700">
                            Allocated Sections
                          </label>
                          <select
                            id="section"
                            name="section"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm">
                            {filteredResult[0]?.section.map(
                              (sectionArray, gradeIndex) => (
                                <optgroup
                                  key={gradeIndex}
                                  label={`Grade ${filteredResult[0]?.grade[gradeIndex]}`}>
                                  {sectionArray.map((section, index) => (
                                    <option
                                      key={`${gradeIndex}-${index}`}
                                      value={section.id}>
                                      {section.name}
                                    </option>
                                  ))}
                                </optgroup>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 ">
                        <label
                          htmlFor="subjects"
                          className="block font-medium text-gray-700">
                          Allocated Subjects
                        </label>
                        <select
                          id="subjects"
                          name="subjects"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm">
                          {filteredResult[0]?.subject.map(
                            (subjectArray, gradeIndex) => (
                              <optgroup
                                key={gradeIndex}
                                label={`Grade ${filteredResult[0]?.grade[gradeIndex]}`}>
                                {subjectArray.map((subject, index) => (
                                  <option
                                    key={`${gradeIndex}-${index}`}
                                    value={subject.id}>
                                    {subject.name}
                                  </option>
                                ))}
                              </optgroup>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={closeDialog}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-4">
                  Close
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Manage;