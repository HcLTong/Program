<template>
  <el-form :model="form" label-width="100px">
    <el-form-item label="任务标题">
      <el-input v-model="form.title" placeholder="请输入任务标题" />
    </el-form-item>
    <el-form-item label="任务描述">
      <el-input v-model="form.description" type="textarea" placeholder="请输入任务描述" :rows="3" />
    </el-form-item>
    <el-form-item label="优先级">
      <el-select v-model="form.priority" placeholder="请选择优先级" style="width: 100%">
        <el-option label="高" value="high" />
        <el-option label="中" value="medium" />
        <el-option label="低" value="low" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
        <el-option label="待处理" value="pending" />
        <el-option label="进行中" value="in-progress" />
        <el-option label="已完成" value="completed" />
      </el-select>
    </el-form-item>
    <el-form-item label="截止日期">
      <el-date-picker
        v-model="form.dueDate"
        type="date"
        placeholder="选择截止日期"
        style="width: 100%"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:form'])

// 表单数据
const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  dueDate: ''
})

// 监听父组件传递的task，用于编辑时填充表单
watch(() => props.task, (newTask) => {
  if (newTask) {
    Object.assign(form, newTask)
  } else {
    // 重置表单
    Object.assign(form, {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: ''
    })
  }
}, { immediate: true })

// 监听表单变化，通知父组件
watch(form, (newForm) => {
  emit('update:form', newForm)
}, { deep: true })
</script>