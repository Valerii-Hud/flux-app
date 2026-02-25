import { responseWithError } from '../errors/response.errors';
import Notification from '../models/notification.model';
import type { AuthRequest } from '../types';
import isError from '../utils/isError.util';
import type { Response } from 'express';

export const getAllNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const notifications = await Notification.find({ to: userId }).populate({
      path: 'from',
      select: 'userName profileImage',
    });
    if (!notifications) res.status(200).json([]);

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    isError({
      error,
      functionName: getAllNotifications.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};

export const deleteAllNotifications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    const notifications = await Notification.find({ to: userId });

    if (notifications.length === 0) {
      return res.status(200).json({ message: 'No notifications to delete' });
    }
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: 'Notifications deleted successfully' });
  } catch (error) {
    isError({
      error,
      functionName: deleteAllNotifications.name,
      handler: 'controller',
    });
    responseWithError(res);
  }
};
