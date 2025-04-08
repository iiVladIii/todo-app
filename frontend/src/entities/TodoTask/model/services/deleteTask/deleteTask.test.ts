import { deleteTask } from './deleteTask';
import { $api } from '@/shared/api/api';

// Mock the API module
jest.mock('@/shared/api/api', () => ({
    $api: {
        delete: jest.fn(),
    },
}));

describe('deleteTask', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call API with correct task ID', async () => {
        // Arrange
        const taskId = 123;
        const mockResponse = { data: { success: true } };
        ($api.delete as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await deleteTask(taskId);

        // Assert
        expect($api.delete).toHaveBeenCalledWith(`/todos/tasks/${taskId}`);
        expect(result).toEqual(mockResponse);
    });

    it('should throw an error when API call fails', async () => {
        // Arrange
        const taskId = 456;
        const mockError = new Error('API Error');
        ($api.delete as jest.Mock).mockRejectedValue(mockError);

        // Act & Assert
        await expect(deleteTask(taskId)).rejects.toThrow('API Error');
        expect($api.delete).toHaveBeenCalledWith(`/todos/tasks/${taskId}`);
    });

    it('should work with different task IDs', async () => {
        // Arrange
        const taskId = 789;
        const mockResponse = { data: { success: true } };
        ($api.delete as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await deleteTask(taskId);

        // Assert
        expect($api.delete).toHaveBeenCalledWith(`/todos/tasks/${taskId}`);
        expect(result).toEqual(mockResponse);
    });

    it('should handle zero as a valid task ID', async () => {
        // Arrange
        const taskId = 0;
        const mockResponse = { data: { success: true } };
        ($api.delete as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await deleteTask(taskId);

        // Assert
        expect($api.delete).toHaveBeenCalledWith(`/todos/tasks/${taskId}`);
        expect(result).toEqual(mockResponse);
    });
});
