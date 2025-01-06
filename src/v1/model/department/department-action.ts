import mongoose from 'mongoose';
import STATUS_CODE from '../../../helper/statusCode';
import { IActionDepartment } from '../../types/model/model-action';
import { ServerError, ServerResponse } from '../../utils/response';
import { departmentModel } from './department';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const checkRecordResult = await departmentModel.findOne(checkData);

    if (checkRecordResult === null) {
      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry! This Department Not Found!', null);
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
  async fetchAllDepartmentAction(): Promise<any> {
    try {
      const departmentList = await departmentModel.aggregate([
        {
          $addFields: {
            created_at: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$created_at' }
              }
            }
          }
        },
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      if (departmentList?.length > 0) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'DEPARTMENTS FETCHED SUCCESSFULLY',
          departmentList
        );
      } else {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'DEPARTMENT LIST NOT FOUND', null);
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async fetchSingleDepartmentAction({ id }: IActionDepartment['single_department']): Promise<any> {
    try {
      const singleDepartmentList = await departmentModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $addFields: {
            created_at: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$created_at' }
              }
            }
          }
        },
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      if (singleDepartmentList?.length) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'DEPARTMENT FETCH SUCCESSFULLY',
          singleDepartmentList[0]
        );
      } else {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'DEPARTMENT LIST NOT FOUND', null);
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

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
      if (savedDepartment) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'DEPARTMENT CREATED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
          'Sorry! This department has not created, Please try again later',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
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

      if (updatedDepartment) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'DEPARTMENT UPDATED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_MODIFIED,
          'DEPARTMENT NOT FOUND OR UPDATE FAILED',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
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

      if (updatedStatusDepartment) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'DEPARTMENT STATUS UPDATED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_MODIFIED,
          'SORRY! THIS DEPARTMENT STATUS IS BEEN NOT UPDATED.',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async permanentlyDeleteDepartmentAction({
    id,
    name
  }: IActionDepartment['permanently_delete_department']): Promise<any> {
    const departmentCheck = await checkRecordFound({ _id: id, name: name });

    if (departmentCheck === false) {
      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'SORRY! THIS DEPARTMENT IS NOT FOUND!', null);
    }

    try {
      const deleteDepartmentAction = await departmentModel.findOneAndDelete({
        _id: id,
        name: name
      });

      if (deleteDepartmentAction) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'DEPARTMENT PERMANENTLY DELETED SUCCESSFULLY',
          true
        );
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'SORRY! THIS DEPARTMENT HAS BEEN NOT DELETED!',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }
}

export default new DepartmentModelAction();
