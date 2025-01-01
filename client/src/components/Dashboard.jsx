import React, { useEffect, useState } from "react";
import NavbarDashboard from "./NavbarDashboard";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const Dashboard = ({ theme, toggleTheme }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    dueSoon: 0,
    priority: {
      high: 0,
      medium: 0,
      low: 0,
    },
  });

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get("http://localhost:5000/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const calculateStats = (todoData) => {
    const now = new Date();
    const in24hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const stats = {
      total: todoData.length,
      completed: todoData.filter((todo) => todo.is_complete).length,
      pending: todoData.filter((todo) => !todo.is_complete).length,
      dueSoon: todoData.filter((todo) => {
        if (!todo.due_date) return false;
        const dueDate = new Date(todo.due_date);
        return dueDate > now && dueDate <= in24hours && !todo.is_complete;
      }).length,
      priority: {
        high: todoData.filter((todo) => todo.priority === "high").length,
        medium: todoData.filter((todo) => todo.priority === "medium").length,
        low: todoData.filter((todo) => todo.priority === "low").length,
      },
    };
    setStats(stats);
  };

  const handleEdit = (todo) => {
    setEditingTodo({
      ...todo,
      due_date: todo.due_date ? todo.due_date.split("T")[0] : "",
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      await axios.put(
        `http://localhost:5000/todos/${editingTodo.todo_id}`,
        editingTodo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowEditModal(false);
      setEditingTodo(null);
      fetchTodos();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      const token = localStorage.getItem("auth_token");
      await axios.delete(`http://localhost:5000/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowDeleteModal(false);
      setTodoToDelete(null);
      fetchTodos();
    } catch (error) {
      console.error(error.message);
    }
  };

  const recentTodos = todos
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Custom Modal Component
  const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-backgroundDark bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };
  return (
    <div className="w-full max-h-screen flex flex-col bg-gray-50 dark:bg-backgroundDark">
      <NavbarDashboard theme={theme} toggleTheme={toggleTheme} />

      <div className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Status-status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Tasks
                    </p>
                    <h3 className="text-2xl font-bold">{stats.total}</h3>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Completed
                    </p>
                    <h3 className="text-2xl font-bold">{stats.completed}</h3>
                  </div>
                  <Circle className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Pending
                    </p>
                    <h3 className="text-2xl font-bold">{stats.pending}</h3>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Due Soon
                    </p>
                    <h3 className="text-2xl font-bold">{stats.dueSoon}</h3>
                  </div>
                  <Clock className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Grafik sama Todos yg ada */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grafik Low Medium High */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Priority Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "High", value: stats.priority.high },
                        { name: "Medium", value: stats.priority.medium },
                        { name: "Low", value: stats.priority.low },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Todos yg ada */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
                <div className="space-y-4">
                  {recentTodos.map((todo) => (
                    <div
                      key={todo.todo_id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            todo.priority === "high"
                              ? "bg-red-500"
                              : todo.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{todo.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Due:{" "}
                            {todo.due_date
                              ? new Date(todo.due_date).toLocaleDateString()
                              : "No due date"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(todo)}
                          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            setTodoToDelete(todo);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            todo.is_complete
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {todo.is_complete ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Buat Edit Todos*/}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTodo(null);
        }}
        title="Edit Task"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 px-3 py-2"
              value={editingTodo?.title || ""}
              onChange={(e) =>
                setEditingTodo({ ...editingTodo, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 px-3 py-2"
              rows="3"
              value={editingTodo?.description || ""}
              onChange={(e) =>
                setEditingTodo({ ...editingTodo, description: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 px-3 py-2"
              value={editingTodo?.due_date || ""}
              onChange={(e) =>
                setEditingTodo({ ...editingTodo, due_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 px-3 py-2"
              value={editingTodo?.priority || ""}
              onChange={(e) =>
                setEditingTodo({ ...editingTodo, priority: e.target.value })
              }
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                checked={editingTodo?.is_complete || false}
                onChange={(e) =>
                  setEditingTodo({
                    ...editingTodo,
                    is_complete: e.target.checked,
                  })
                }
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mark as completed
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setEditingTodo(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:hover:bg-blue-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Buat Ngehapus Todo */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTodoToDelete(null);
        }}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {!todoToDelete?.is_complete
              ? "This task is not completed. Are you sure you want to delete it?"
              : "Are you sure you want to delete this completed task?"}
          </p>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setTodoToDelete(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(todoToDelete.todo_id)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:hover:bg-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
