import { updateTask } from './updateTask';
import { $api } from '@/shared/api/api';
// Mock the API module
jest.mock('@/shared/api/api', () => ({
    $api: {
        put: jest.fn(),
    },
}));

describe('updateTask', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call API with correct parameters', async () => {
        // Arrange
        const taskData = {
            taskId: 123,
            title: 'Updated Task',
            completed: true,
        };

        const mockResponse = {
            data: {
                id: 123,
                title: 'Updated Task',
                completed: true,
            },
        };

        ($api.put as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await updateTask(taskData);

        // Assert
        expect($api.put).toHaveBeenCalledWith(
            `/todos/tasks/${taskData.taskId}`,
            { title: taskData.title, completed: taskData.completed }
        );
        expect(result).toEqual(mockResponse);
    });

    it('should handle task marked as not completed', async () => {
        // Arrange
        const taskData = {
            taskId: 456,
            title: 'Not Completed Task',
            completed: false,
        };

        const mockResponse = {
            data: {
                id: 456,
                title: 'Not Completed Task',
                completed: false,
            },
        };

        ($api.put as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await updateTask(taskData);

        // Assert
        expect($api.put).toHaveBeenCalledWith(
            `/todos/tasks/${taskData.taskId}`,
            { title: taskData.title, completed: taskData.completed }
        );
        expect(result).toEqual(mockResponse);
    });

    it('should throw an error when API call fails', async () => {
        // Arrange
        const taskData = {
            taskId: 789,
            title: 'Error Task',
            completed: true,
        };

        const mockError = new Error('API Error');
        ($api.put as jest.Mock).mockRejectedValue(mockError);

        // Act & Assert
        await expect(updateTask(taskData)).rejects.toThrow('API Error');
        expect($api.put).toHaveBeenCalledWith(
            `/todos/tasks/${taskData.taskId}`,
            { title: taskData.title, completed: taskData.completed }
        );
    });

    it('should work with empty title', async () => {
        // Arrange
        const taskData = {
            taskId: 999,
            title: '',
            completed: true,
        };

        const mockResponse = {
            data: {
                id: 999,
                title: '',
                completed: true,
            },
        };

        ($api.put as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await updateTask(taskData);

        // Assert
        expect($api.put).toHaveBeenCalledWith(
            `/todos/tasks/${taskData.taskId}`,
            { title: taskData.title, completed: taskData.completed }
        );
        expect(result).toEqual(mockResponse);
    });

    it('should handle zero as a valid task ID', async () => {
        // Arrange
        const taskData = {
            taskId: 0,
            title: 'Zero ID Task',
            completed: false,
        };

        const mockResponse = {
            data: {
                id: 0,
                title: 'Zero ID Task',
                completed: false,
            },
        };

        ($api.put as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await updateTask(taskData);

        // Assert
        expect($api.put).toHaveBeenCalledWith(
            `/todos/tasks/${taskData.taskId}`,
            { title: taskData.title, completed: taskData.completed }
        );
        expect(result).toEqual(mockResponse);
    });
});
