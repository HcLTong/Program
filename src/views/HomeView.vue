<template>
  <div class="home-container">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <span>个人任务管理系统</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon>
              <Plus />
            </el-icon> 新建任务
          </el-button>
        </div>
      </template>

      <!-- 搜索和筛选 -->
      <div class="filter-section">
        <el-input v-model="searchKeyword" placeholder="搜索任务..." style="width: 200px; margin-right: 16px;" clearable>
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>

        <el-select v-model="filterStatus" placeholder="筛选状态">
          <el-option label="全部" value="all" />
          <el-option label="待处理" value="pending" />
          <el-option label="进行中" value="in-progress" />
          <el-option label="已完成" value="completed" />
        </el-select>
      </div>

      <!-- 任务列表 -->
      <div class="task-list">
        <el-table :data="filteredTasks" style="width: 100%">
          <el-table-column prop="title" label="任务标题" width="180" />
          <el-table-column prop="description" label="任务描述" />
          <el-table-column prop="priority" label="优先级" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.priority === 'high' ? 'danger' : 
                      scope.row.priority === 'medium' ? 'warning' : 'success'">
                {{ scope.row.priority === 'high' ? '高' :
                scope.row.priority === 'medium' ? '中' : '低' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'completed' ? 'success' : 
                      scope.row.status === 'in-progress' ? 'warning' : 'info'">
                {{ scope.row.status === 'completed' ? '已完成' :
                scope.row.status === 'in-progress' ? '进行中' : '待处理' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="dueDate" label="截止日期" width="120" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteTask(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="filteredTasks.length === 0" class="empty-state">
          <el-empty description="暂无任务" />
        </div>
      </div>
    </el-card>

    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <TaskForm :task="currentTask" @update:form="handleFormUpdate" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="saveTask">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { useTaskStore } from '@/stores/task'
import TaskForm from '@/components/TaskForm.vue'

const taskStore = useTaskStore()

// 搜索和筛选
const searchKeyword = ref('')
const filterStatus = ref('all')

// 对话框状态
const dialogVisible = ref(false)
const currentTask = ref(null)

// 计算属性
const dialogTitle = computed(() => {
  return currentTask.value ? '编辑任务' : '新建任务'
})

const filteredTasks = computed(() => {
  let tasks = taskStore.getTasks
  
  // 按状态筛选
  if (filterStatus.value && filterStatus.value !== 'all') {
    tasks = tasks.filter(task => task.status === filterStatus.value)
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    tasks = tasks.filter(task => 
      task.title.toLowerCase().includes(keyword) ||
      (task.description && task.description.toLowerCase().includes(keyword))
    )
  }
  
  return tasks
})

// 方法
const openAddDialog = () => {
  currentTask.value = null
  formData.value = { 
    title: '', 
    description: '', 
    priority: 'medium', 
    status: 'pending', 
    dueDate: '' 
  }
  dialogVisible.value = true
}

const openEditDialog = (task) => {
  currentTask.value = task
  formData.value = { ...task }
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  currentTask.value = null
}

// 表单数据
const formData = ref({})

// 处理表单更新
const handleFormUpdate = (form) => {
  formData.value = form
}

//保存任务
const saveTask = () => {
  if (!formData.value.title.trim()) {
    ElMessage.error('请输入任务标题')
    return
  }

  if (currentTask.value) {
    // 编辑任务
    taskStore.updateTask(currentTask.value.id, formData.value)
    ElMessage.success('任务更新成功')
  } else {
    // 新建任务
    taskStore.addTask(formData.value)
    ElMessage.success('任务创建成功')
  }
  
  closeDialog()
}

const deleteTask = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    taskStore.deleteTask(id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消了删除
  }
}
</script>

<style scoped>
/* 让容器铺满整个屏幕 */
.home-container {
  height: 100vh; /* 使用视口高度 */
  width: 100vmax;/*铺满屏幕*/
  padding: 0; /* 移除内边距 */
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5; /* 与 body 背景色一致 */
}

/* 让卡片占据全部可用空间 */
.main-card {
  flex: 1; /* 占据剩余空间 */
  width: 100%;
  margin: 0; /* 移除外边距 */
  display: flex;
  flex-direction: column;
  border-radius: 0; /* 移除圆角让边缘更整齐 */
  box-shadow: none; /* 移除阴影 */
}

/* 调整卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

/* 调整筛选区域样式 */
.filter-section {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  background-color: #fafafa;
}

/* 让任务列表占据剩余空间并可以滚动 */
.task-list {
  flex: 1;
  overflow: auto; /* 内容超出时显示滚动条 */
  padding: 0;
}

/* 调整表格样式 */
:deep(.el-table) {
  height: 100%;
}

:deep(.el-table__body-wrapper) {
  overflow: auto;
}


/* 空状态居中显示 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

/* 对话框样式调整 */
:deep(.el-dialog) {
  margin: 5vh auto !important; /* 对话框垂直居中 */
}

:deep(.el-dialog__body) {
  max-height: 60vh;
  overflow: auto;
}
</style>