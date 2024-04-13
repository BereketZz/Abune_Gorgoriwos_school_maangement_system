import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  user: { first_name: string; last_name: string; id: number };
  gradeId: number[];
}

interface Grade {
  id: number;
  grade: string;
}

interface SubjectData {
  id: number;
  name: string;
  gradeId: number;
  gradelevel: {
    id: number;
    grade: string;
    teacher: Teacher[];
  };
  teacherId?: number;
}

const SubjectComponent = () => {
  const [subject, setSubject] = useState('');
  const [gradeId, setGradeId] = useState<number | null>(null);
  const [teacherId, setTeacherId] = useState<number | null |undefined>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [classData, setClassData] = useState<SubjectData[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade] = useState('');

  useEffect(() => {
    fetchGrades();
    fetchTeachers();
    handleManageSubject();
  }, []);

  useEffect(() => {
    handleManageSubject();
  }, [currentPage, rowsPerPage, filterTeacher, filterSubject, filterGrade]);

  const fetchGrades = async () => {
    try {
      const response = await axios.get<Grade[]>('http://localhost:3333/grade/get');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setError('An error occurred while fetching grades');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get<Teacher[]>('http://localhost:3333/teachers/get');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('An error occurred while fetching teachers');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'gradeId') {
      setGradeId(value === '' ? null : parseInt(value) || null);
      setTeacherId(null);
    } else if (name === 'teacherId') {
      setTeacherId(value === '' || value === undefined ? null : parseInt(value));
    }
  };

  const handleCreateNewClass = () => {
    setShowCreateForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleManageSubject = async (subjectId?: number) => {
    setShowCreateForm(false);
    try {
      let response;
      if (subjectId) {
        response = await axios.get<SubjectData>(`http://localhost:3333/subjects/get/${subjectId}`);
        setSelectedSubject(response.data);
        setShowModal(true);
      } else {
        response = await axios.get<SubjectData[]>('http://localhost:3333/subjects/get');
        setClassData(response.data);
      }
      setError('');
      setSuccessMessage('');
    } catch (error) {
      console.error('Error fetching class data:', error);
      setError('An error occurred while fetching class data');
    }
  };

  const handleUpdateSubject = async () => {
    if (!selectedSubject) {
      setError('Please select a subject to update.');
      return;
    }
    if (!selectedSubject.name || !selectedSubject.gradeId || !selectedSubject.teacherId) {
      setError('Please fill in all the fields to update the subject.');
      return;
    }
    try {
      await axios.patch(`http://localhost:3333/subjects/update/${selectedSubject.id}`, {
        name: selectedSubject.name,
        gradeId: selectedSubject.gradeId,
        teacherId: selectedSubject.teacherId
      });
      handleManageSubject();
      setError('');
      setShowModal(false);
      toast.success('Subject updated successfully');
    } catch (error) {
      console.error('Error updating subject:', error);
      setError('An error occurred while updating the subject');
      toast.error('An error occurred while updating the subject');
    }
  };


  const handleDeleteSubject = async (subjectId: number) => {
    const selectedSubject = classData.find(subject => subject.id === subjectId);
    if (selectedSubject) {
      setSelectedSubject(selectedSubject);
      setShowModalDelete(true);
    } else {
      console.error('Subject not found');
    }
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:3333/subjects/delete/${selectedSubject?.id}`)
      .then(() => {
        setClassData(classData.filter(subject => subject.id !== selectedSubject?.id));
        toast.success('Subject deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting subject:', error);
        setError('An error occurred while deleting the subject');
      })
      .finally(() => {
        setShowModalDelete(false);
      });
  };

  const handleSubmit = async () => {
    if (!subject || !gradeId || !teacherId) {
      setError('Please fill in all the fields');
      return;
    }

    try {
      await axios.post('http://localhost:3333/subjects/add', { name: subject, gradeId, teacherId });
      setSubject('');
      setGradeId(null);
      setTeacherId(null);
      setError('');
      handleManageSubject();
      toast.success('Subject added successfully');
    } catch (error) {
      console.error('Error registering subject:', error);
      setError('An error occurred while registering the subject');
      toast.error('An error occurred while registering the subject');
    }
  };

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = classData.slice(indexOfFirstRow, indexOfLastRow);

  // Update Pagination Data
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full p-8 mt-8 text-center">
      {/* {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>} */}
      <div className="w-full flex flex-wrap gap-4 mb-4">
        <button
          className="bg-blue-50 hover:bg-blue-100 text-green-900 font-semibold py-2 px-4 rounded-md"
          onClick={() => handleManageSubject()}
        >
          Manage Subject
        </button>
        <button
          className="bg-blue-50 hover:bg-blue-100 text-green-900 font-semibold py-2 px-4 rounded-md"
          onClick={handleCreateNewClass}
        >
          Create New Subject
        </button>
      </div>
      {/* Create new subject form */}
      {showCreateForm && (
        <div className="w-full max-w-md">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md mb-4 block"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <select
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
            value={gradeId || ''}
            onChange={handleChange}
            name="gradeId"
            
          >
            <option value="">Select Grade</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.grade}
              </option>
            ))}
          </select>
  {gradeId !== null && (
        <select
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              value={teacherId || ''}
              onChange={handleChange}
              name="teacherId"
            >
             {teachers.map((teacher) => {
    // Check if the teacher is assigned to the selected grade level
    const isTeacherAssignedToGrade = teacher.gradeId.includes(gradeId);

    // If the teacher is assigned to the selected grade level, display them in the dropdown list
    if (isTeacherAssignedToGrade) {
      return (
        <option key={teacher.id} value={teacher.id}>
          {teacher.first_name} {teacher.last_name}
        </option>
      );
    }
    return null; // Skip this teacher if not assigned to the selected grade level
  })}
            </select>
          )}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            className="bg-green-500 hover:bg-blue-300 text-white font-semibold py-2 px-4 rounded-md w-full"
            onClick={handleSubmit}
          >
            <SendIcon sx={{ marginRight: 1 }} /> {/* Adjusting margin for icon alignment */}
            Submit
          </button>
        </div>
      )}
      {/* Table with Paginated and Filtered Data */}
      {!showCreateForm && (
        <div className="mt-8 w-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="mr-2">Rows per page:</label>
              <select value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
          </div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Subject Name</th>
                <th className="py-2 px-4 border-b">Grade</th>
                <th className="py-2 px-4 border-b">Teacher</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((subject) => (
                <tr key={subject.id}>
                  <td className="py-2 px-4 border-b">{subject.id}</td>
                  <td className="py-2 px-4 border-b">{subject.name}</td>
                  <td className="py-2 px-4 border-b">{subject.gradelevel?.grade}</td>
                  <td className="py-2 px-4 border-b">
                    {subject.teacherId ? (
                      <span>
                        {subject.gradelevel?.teacher?.find(teacher => teacher.user.id === (subject.teacherId || 0))?.user.first_name}{' '}
                        {subject.gradelevel?.teacher?.find(teacher => teacher.user.id === (subject.teacherId || 0))?.user.last_name}
                      </span>
                    ) : (
                      <span>No teacher assigned</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <IconButton color="primary" size="small" onClick={() => handleManageSubject(subject.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" size="small" onClick={() => handleDeleteSubject(subject.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
   
      {/* Existing code... */}
      {showModal && selectedSubject && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 text-center font-medium text-gray-900 mb-4">Update Subject</h3>
              <div className="mt-2 mx-auto max-w-md">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 block"
                  placeholder="Subject"
                  value={selectedSubject.name}
                  onChange={(e) =>
                    setSelectedSubject({
                      ...selectedSubject,
                      name: e.target.value,
                    })
                  }
                />
                <select
                  className="w-full p-3 border border-gray-300 rounded-md mb-4"
                  value={selectedSubject.gradeId}
                  disabled
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.grade}
                    </option>
                     ))}
                </select>
                <select
  className="w-full p-3 border border-gray-300 rounded-md mb-4"
  value={selectedSubject.teacherId}
  onChange={(e) =>
    setSelectedSubject({
      ...selectedSubject,
      teacherId: parseInt(e.target.value),
    })
  }
>
  <option value="">Select Teacher</option>
  {teachers.map((teacher) => {
    // Check if the teacher is assigned to the selected grade level
    const isTeacherAssignedToGrade = teacher.gradeId.includes(selectedSubject.gradeId);

    // If the teacher is assigned to the selected grade level, display them in the dropdown list
    if (isTeacherAssignedToGrade) {
      return (
        <option key={teacher.id} value={teacher.id}>
          {teacher.first_name} {teacher.last_name}
        </option>
      )
    }
    return null; // Skip this teacher if not assigned to the selected grade level
  })}
</select>


               
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={handleUpdateSubject}
                    className="bg-green-500 hover:bg-blue-300 text-white font-semibold py-2 px-4 rounded-md ml-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
)}
      {showModalDelete && selectedSubject && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white rounded-lg p-8 z-10">
            <p className="mb-4 text-xl">Are you sure you want to delete this subject?</p>
            <div className="flex justify-end">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 mr-2 rounded" onClick={() => setShowModalDelete(false)}>
                Cancel
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right"/>
    </div>
  );
};

export default SubjectComponent;