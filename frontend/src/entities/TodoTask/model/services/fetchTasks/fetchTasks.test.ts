import { fetchTasks } from './fetchTasks';
import { $api } from '@/shared/api/api';
import { TodoTask } from '../../types/TodoTask';

// Mock the API module
jest.mock('@/shared/api/api', () => ({
    $api: {
        get: jest.fn(),
    },
}));

describe('fetchTasks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call API with correct list ID', async () => {
        // Arrange
        const listId = 123;
        const mockTasks: TodoTask[] = [
            { id: 1, title: 'Task 1', completed: false, listId: listId },
            { id: 2, title: 'Task 2', completed: true, listId: listId },
        ];
        const mockResponse = { data: mockTasks };
        ($api.get as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await fetchTasks(listId);

        // Assert
        expect($api.get).toHaveBeenCalledWith(`/todos/${listId}/tasks`);
        expect(result).toEqual(mockResponse);
    });

    it('should return empty array when no tasks are found', async () => {
        // Arrange
        const listId = 456;
        const mockResponse = { data: [] };
        ($api.get as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await fetchTasks(listId);

        // Assert
        expect($api.get).toHaveBeenCalledWith(`/todos/${listId}/tasks`);
        expect(result).toEqual(mockResponse);
        expect(result.data).toEqual([]);
    });

    it('should throw an error when API call fails', async () => {
        // Arrange
        const listId = 789;
        const mockError = new Error('API Error');
        ($api.get as jest.Mock).mockRejectedValue(mockError);

        // Act & Assert
        await expect(fetchTasks(listId)).rejects.toThrow('API Error');
        expect($api.get).toHaveBeenCalledWith(`/todos/${listId}/tasks`);
    });

    it('should work with different list IDs', async () => {
        // Arrange
        const listId = 999;
        const mockTasks: TodoTask[] = [
            { id: 3, title: 'Task 3', completed: false, listId: 999 },
        ];
        const mockResponse = { data: mockTasks };
        ($api.get as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await fetchTasks(listId);

        // Assert
        expect($api.get).toHaveBeenCalledWith(`/todos/${listId}/tasks`);
        expect(result).toEqual(mockResponse);
    });

    it('should handle zero as a valid list ID', async () => {
        // Arrange
        const listId = 0;
        const mockTasks: TodoTask[] = [
            { id: 4, title: 'Task 4', completed: true, listId: listId },
        ];
        const mockResponse = { data: mockTasks };
        ($api.get as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await fetchTasks(listId);

        // Assert
        expect($api.get).toHaveBeenCalledWith(`/todos/${listId}/tasks`);
        expect(result).toEqual(mockResponse);
    });
});
