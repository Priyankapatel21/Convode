import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from "../config/axios";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, setUser } = useContext(UserContext);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ projectName, setProjectName ] = useState('');
    const [ projects, setProjects ] = useState([]);
    const navigate = useNavigate();

    // Helper: Keeps first letter Capital and all others small (Sentence Case)
    const capitalize = (name) => {
        if (!name) return "User";
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    // Fetch all projects on mount
    useEffect(() => {
        axios.get('/projects/all')
            .then(res => {
                setProjects(res.data.projects || []);
            })
            .catch(err => {
                console.error("Error fetching projects:", err);
            });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/', { replace: true });
    };

    const deleteProject = (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            axios.delete(`/projects/delete/${id}`)
                .then(() => {
                    // Update UI immediately by filtering out the deleted project
                    setProjects(prev => prev.filter(p => p._id !== id));
                })
                .catch(err => {
                    console.error("Delete failed:", err);
                    alert("Unable to delete project. You may not have permission.");
                });
        }
    };

    const createProject = (e) => {
        e.preventDefault();
        axios.post('/projects/create', { name: projectName })
            .then((res) => {
                setIsModalOpen(false);
                
                // Extract project data (handles both {project: {}} and flat {} responses)
                const newProject = res.data.project || res.data;
                
                // Update state correctly
                setProjects(prev => [...prev, newProject]);
                setProjectName('');
            })
            .catch(err => {
                console.error("Create project failed:", err.response?.data || err.message);
                alert("Error creating project. Please try again.");
            });
    };

    return (
        <main className="min-h-screen bg-[#0E1629] text-white font-sans selection:bg-blue-500/30">
            
            {/* Header: Fixed & Glassmorphism */}
            <header className="fixed top-0 w-full z-50 bg-[#0a0f1e]/80 backdrop-blur-md px-6 py-4 border-b border-gray-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-2xl font-bold tracking-tight font-['Nunito']">
                    <span className="text-blue-500 font-mono">{"< >"}</span>
                    <span>CONVODE</span>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm italic">Welcome,</span>
                        <span className="text-sm font-bold text-white tracking-wider">
                            {capitalize(user?.username)}
                        </span>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 border border-red-500/20"
                    >
                        Logout <i className="ri-logout-box-r-line"></i>
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto pt-36 pb-20 px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">My Projects</h1>
                        <p className="text-gray-400 font-medium">Manage your coding projects and collaborate with others</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <i className="ri-add-line text-xl"></i> New Project
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.length > 0 ? (
                        projects.map((proj) => (
                            <div key={proj._id} className="bg-[#161b2b] rounded-2xl border border-gray-800 p-6 flex flex-col relative group hover:border-blue-500/50 transition-all shadow-xl">
                                
                                {/* Quick Actions */}
                                <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="text-blue-400 hover:text-blue-300 p-1"><i className="ri-edit-line text-lg"></i></button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteProject(proj._id); }} 
                                        className="text-red-500 hover:text-red-400 p-1"
                                    >
                                        <i className="ri-delete-bin-line text-lg"></i>
                                    </button>
                                </div>

                                <h2 className="text-2xl font-bold mb-4 pr-16 capitalize truncate">{proj.name}</h2>
                                
                                <div className="space-y-3 mb-8 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <i className="ri-calendar-line text-blue-500/70"></i>
                                        <span>
    Updated {proj.updatedAt 
        ? new Date(proj.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
        : 'Just now'}
</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="ri-group-line text-green-500/70"></i>
                                        <span>{proj.users?.length || 0} Collaborators</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate(`/project`, { state: { project: proj } })}
                                    className="w-full bg-[#1e253a] border border-gray-700 py-3 rounded-lg font-bold text-sm hover:bg-blue-600 hover:border-blue-500 transition-all"
                                >
                                    Open Project
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl">
                            <p className="text-gray-500">No projects found. Create your first project to get started!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-[#161b2b] rounded-3xl p-8 w-full max-w-md border border-gray-800 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm mb-2 ml-1">Project Name</label>
                                <input 
                                    autoFocus 
                                    value={projectName} 
                                    onChange={(e) => setProjectName(e.target.value)} 
                                    type="text" 
                                    className="w-full p-4 rounded-xl bg-[#0E1629] border border-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-gray-600" 
                                    placeholder="e.g. Portfolio Website" 
                                    required 
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="px-6 py-2 rounded-xl font-bold text-gray-400 hover:bg-gray-800 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Dashboard;