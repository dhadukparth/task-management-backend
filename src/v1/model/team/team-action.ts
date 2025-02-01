import mongoose from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { teamPipelines } from '../../Pipelines';
import { ServerError, ServerResponse } from '../../utils/response';
import { teamModel } from './team';

class TeamModelAction {
  async getAllTeamAction() {
    try {
      const teamList = await teamModel.aggregate([
        {
          $match: {
            is_active: true
          }
        },
        ...teamPipelines.team_pipelines,
        {
          $sort: {
            created_at: -1 // Sort by created_at in descending order
          }
        }
      ]);

      return ServerResponse(STATUS_CODE.CODE_OK, 'Team fetched successfully.', teamList);
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to fetch project list.',
        error
      );
    }
  }

  async getSingleTeamAction(args: { teamId: string; name: string }) {
    try {
      const teamData = await teamModel.aggregate([
        {
          $match: {
            $or: [{ _id: args.teamId }, { name: args.name }]
          }
        },
        ...teamPipelines.team_pipelines,
        {
          $sort: {
            created_at: -1 // Sort by created_at in descending order
          }
        }
      ]);

      if (teamData.length) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Team fetched successfully.', teamData?.[0]);
      } else {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry! This team is not found!.', null);
      }
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to fetch project list.',
        error
      );
    }
  }

  async createTeamAction(args: {
    name: string;
    description: string;
    leader: string[];
    employee: string[];
    manager: string[];
    technologies: string[];
    createdUser: string;
  }) {
    try {
      const checkTeam = {
        name: args.name
      };

      const apiCheckTeam = await teamModel.findOne(checkTeam);
      if (apiCheckTeam) {
        return ServerResponse(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry! This team name is already existed.',
          false
        );
      }

      const newTeam = new teamModel({
        name: args.name,
        description: args.description,
        createdUser: args.createdUser,
        leader: args.leader,
        employee: args.employee,
        manager: args.manager,
        technologies: args.technologies,
        created_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
      });

      const newTeamResult = await newTeam.save();

      if (newTeamResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Team created successfully.', true);
      }

      return ServerResponse(
        STATUS_CODE.CODE_NOT_MODIFIED,
        'Failed to create the team. Please try again.',
        false
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to fetch project list.',
        error
      );
    }
  }

  async updateTeamAction(args: {
    teamId: string;
    name: string;
    description: string;
    leader: string[];
    employee: string[];
    manager: string[];
    technologies: string[];
    createdUser: string;
  }) {
    try {
      const checkTeam = {
        _id: new mongoose.Types.ObjectId(args.teamId),
        name: args.name,
        is_active: true
      };

      const apiCheckTeam = await teamModel.findOne(checkTeam);
      if (!apiCheckTeam) {
        return ServerResponse(STATUS_CODE.CODE_NOT_FOUND, 'Sorry! This team is not found.', false);
      }

      const updateTeamResponse = await teamModel.findOneAndUpdate(
        { _id: args.teamId },
        {
          $set: {
            name: args.name,
            description: args.description,
            updated_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC'),
            leader: args.leader,
            employee: args.employee,
            manager: args.manager,
            technologies: args.technologies
          }
        },
        { new: true, upsert: false } // Return the updated document, do not create if it doesn't exist
      );

      if (updateTeamResponse) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'This team is updated successfully.', true);
      }

      return ServerResponse(
        STATUS_CODE.CODE_NOT_MODIFIED,
        'Sorry! This team is not updated. Please try again.',
        false
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to fetch project list.',
        error
      );
    }
  }

  async changeStatusTeamAction(args: { teamId: string; name: string }) {
    try {
      const checkTeam = {
        _id: new mongoose.Types.ObjectId(args.teamId),
        name: args.name
      };

      const apiCheckTeam = await teamModel.findOne(checkTeam);
      if (!apiCheckTeam) {
        return ServerResponse(STATUS_CODE.CODE_NOT_FOUND, 'Sorry! This team is not found.', false);
      }

      const changeStatus = !apiCheckTeam?.is_active;

      const getTeamResponse = await teamModel.findOneAndUpdate(
        checkTeam,
        {
          $set: {
            is_active: changeStatus
          }
        },
        {
          new: true
        }
      );

      if (getTeamResponse) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          `This team is ${changeStatus ? 'activated' : 'deactivated'} successfully.`,
          true
        );
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_MODIFIED,
        'Sorry! This team status is not changed, please try again.',
        false
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to fetch project list.',
        error
      );
    }
  }

  async deleteTeamAction(args: { teamId: string; name: string }) {
    try {
      const checkTeam = {
        _id: new mongoose.Types.ObjectId(args.teamId),
        name: args.name
      };

      const apiCheckTeam = await teamModel.findOne(checkTeam);
      if (!apiCheckTeam) {
        return ServerResponse(STATUS_CODE.CODE_NOT_FOUND, 'Sorry! This team is not found.', false);
      }

      const changeStatus = !apiCheckTeam?.is_active;

      const getTeamResponse = await teamModel.aggregate([
        {
          $match: checkTeam
        },
        {
          $set: {
            is_active: false,
            deleted_at: null
          }
        }
      ]);

      if (getTeamResponse) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          `This team is ${changeStatus ? 'activated' : 'deactivated'} successfully.`,
          true
        );
      }

      return ServerResponse(
        STATUS_CODE.CODE_NOT_MODIFIED,
        'Sorry! This team status is not changed, please try again.',
        false
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to fetch project list.',
        error
      );
    }
  }
}

export const teamModelAction = new TeamModelAction();
