import STATUS_CODE from '../../../helper/statusCode';
import { IActionDepartment } from '../../types/model/model-action';
import { departmentModel } from './department';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const checkRecordResult = await departmentModel.findOne(checkData);

    if (checkRecordResult === null) {
      return {
        code: STATUS_CODE.CODE_NOT_FOUND,
        message: 'DEPARTMENT NOT FOUND',
        data: null
      };
    }

    return true;
  } catch (error: any) {
    return {
      code: error?.errorResponse?.code,
      message: error?.errorResponse?.errmsg,
      error: error
    };
  }
};

class DepartmentModelAction {
  async createDepartmentAction({
    name,
    description
  }: IActionDepartment['create_department']): Promise<any> {
    try {
      const newDepartment = new departmentModel({
        name: name,
        description: description
      });

      const savedDepartment = await newDepartment.save();
      return {
        code: STATUS_CODE.CODE_CREATED,
        message: 'DEPARTMENT CREATED SUCCESSFULLY',
        data: savedDepartment
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async fetchAllDepartmentAction(): Promise<any> {
    try {
      const departmentList = await departmentModel.find();

      if (!departmentList || departmentList?.length === 0) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'DEPARTMENT LIST NOT FOUND',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'DEPARTMENT FETCH SUCCESSFULLY',
        data: departmentList
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async fetchSingleDepartmentAction({ id }: IActionDepartment['single_department']): Promise<any> {
    try {
      const singleDepartment = await departmentModel.findOne({
        _id: id
      });

      if (!singleDepartment) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'DEPARTMENT NOT FOUND OR ALREADY DELETED',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'DEPARTMENT FETCHED SUCCESSFULLY',
        data: singleDepartment
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'AN ERROR OCCURRED',
        error: error
      };
    }
  }

  async updateDepartmentAction({
    id,
    name,
    description
  }: IActionDepartment['update_department']): Promise<any> {
    try {
      const departmentCheck = await checkRecordFound({ _id: id });

      if (typeof departmentCheck !== 'boolean') {
        return departmentCheck;
      }

      const updatedDepartment = await departmentModel.findByIdAndUpdate(
        { _id: id },
        { name, description },
        { new: true }
      );

      if (!updatedDepartment) {
        return {
          code: STATUS_CODE.CODE_NOT_MODIFIED,
          message: 'DEPARTMENT NOT FOUND OR UPDATE FAILED',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'DEPARTMENT UPDATED SUCCESSFULLY',
        data: updatedDepartment
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async updateStatusDepartmentAction({
    id,
    status
  }: IActionDepartment['update_status_department']): Promise<any> {
    try {
      const checkDepartmentAction = await checkRecordFound({ _id: id });

      if (typeof checkDepartmentAction !== 'boolean') {
        return checkDepartmentAction;
      }

      const updatedStatusDepartment = await departmentModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            is_active: status
          }
        },
        { new: true }
      );

      if (!updatedStatusDepartment) {
        return {
          code: STATUS_CODE.CODE_NOT_MODIFIED,
          message: 'SORRY! THIS DEPARTMENT STATUS IS BEEN NOT UPDATED.',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'DEPARTMENT STATUS UPDATED SUCCESSFULLY',
        data: updatedStatusDepartment
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async permanentlyDeleteDepartmentAction({
    id,
    name
  }: IActionDepartment['permanently_delete_department']): Promise<any> {
    const departmentCheck = await checkRecordFound({ _id: id, name: name });

    if (departmentCheck === false) {
      return {
        code: STATUS_CODE.CODE_NOT_FOUND,
        message: 'SORRY! THIS DEPARTMENT IS NOT FOUND!',
        data: null
      };
    }

    try {
      const deleteDepartmentAction = await departmentModel.findOneAndDelete({
        _id: id,
        name: name
      });

      if (deleteDepartmentAction) {
        return {
          code: STATUS_CODE.CODE_OK,
          message: 'DEPARTMENT PERMANENTLY DELETED SUCCESSFULLY',
          data: deleteDepartmentAction
        };
      } else {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'SORRY! THIS DEPARTMENT HAS BEEN NOT DELETED!',
          data: null
        };
      }
    } catch (error: any) {
      return {
        code: STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: 'ERROR WHILE ROLLING BACK DEPARTMENT',
        error: error
      };
    }
  }
}

export default new DepartmentModelAction();
