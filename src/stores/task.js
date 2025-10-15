import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTaskStore = defineStore('task', () => {
  // 从 localStorage 加载数据，如果没有则使用示例数据
  const loadTasks = () => {
    try {
      const stored = localStorage.getItem('tasks')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    }
    
    return [
      {
        id: 1,
        title: '学习 Vue3 面试题',
        description: '重点准备 ref 和 reactive 的区别',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-05-25'
      },
      {
        id: 2,
        title: '完善个人项目',
        description: '给任务管理系统添加搜索功能',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2024-05-28'
      }
    ]
  }

  const tasks = ref(loadTasks())

  // 保存到 localStorage
  const saveTasks = () => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks.value))
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  }

  // 获取所有任务
  const getTasks = computed(() => tasks.value)

  // 添加任务
  const addTask = (newTask) => {
    const task = {
      id: Date.now(),
      status: 'pending',
      ...newTask
    }
    tasks.value.push(task)
    saveTasks()
    return task
  }

  // 更新任务
  const updateTask = (id, updatedTask) => {
    const index = tasks.value.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updatedTask }
      saveTasks()
      return true
    }
    return false
  }

  // 删除任务
  const deleteTask = (id) => {
    const index = tasks.value.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      saveTasks()
      return true
    }
    return false
  }

  return {
    tasks,
    getTasks,
    addTask,
    updateTask,
    deleteTask
  }
})