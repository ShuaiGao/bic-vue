<script setup lang="ts">
import { IResponseGetRole } from "@/api/admin.pb";
import { type CSSProperties, ref, computed, onMounted } from "vue";

const emit = defineEmits(["closeDialog", "editRoleInfo"]);
const propsData = defineProps({
  userOperation: {
    type: String,
    default: "add"
  },
  roleId: {
    type: Number,
    default: 0
  }
});

const roleInfo = ref<IResponseGetRole>({ id: 0, name: "" });

const cancelEvent = () => {
  emit("closeDialog", false);
};
</script>

<template>
  <el-dialog
    :v-model="true"
    :title="userOperation === 'add' ? '添加角色' : '修改角色'"
    width="500px"
    @close="cancelEvent"
  >
    <el-form
      id="role_form"
      ref="roleFrom"
      :model="roleInfo"
      :rules="rules"
      label-width="90px"
      label-position="right"
    >
      <el-form-item prop="group_alias" label="名称">
        <el-input v-model="roleInfo.group_alias" clearable />
      </el-form-item>
      <el-form-item
        v-if="userOperation === 'add'"
        prop="group_key"
        label="关键字"
      >
        <el-input v-model="roleInfo.group_key" clearable />
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="roleInfo.remark" clearable />
      </el-form-item>
      <el-form-item prop="father_id" label="父角色">
        <el-select
          v-model="roleInfo.father_id"
          placeholder="请选择父角色！"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="permission_list" label="操作权限">
        <el-cascader
          v-model="roleInfo.permission_list"
          collapse-tags
          style="width: 100%"
          collapse-tags-tooltip
          :options="treeNode"
          :show-all-levels="false"
          :props="propsCascader"
          @change="getLeafNode"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelEvent">取消</el-button>
        <el-button type="primary" @click="handleOk">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
