import { createTask } from './createTask';
import { $api } from '@/shared/api/api';

// Mock the API module
jest.mock('@/shared/api/api', () => ({
    $api: {
        post: jest.fn(),
    },
}));

describe('createTask', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call API with correct parameters', async () => {
        // Arrange
        const listId = 123;
        const title = 'New Task';
        const mockResponse = {
            data: {
                id: 1,
                title: 'New Task',
                completed: false,
            },
        };
        ($api.post as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await createTask(listId, title);

        // Assert
        expect($api.post).toHaveBeenCalledWith(`/todos/${listId}/tasks`, {
            title,
        });
        expect(result).toEqual(mockResponse);
    });

    it('should throw an error when API call fails', async () => {
        // Arrange
        const listId = 123;
        const title = 'New Task';
        const mockError = new Error('API Error');
        ($api.post as jest.Mock).mockRejectedValue(mockError);

        // Act & Assert
        await expect(createTask(listId, title)).rejects.toThrow('API Error');
        expect($api.post).toHaveBeenCalledWith(`/todos/${listId}/tasks`, {
            title,
        });
    });

    it('should work with different list IDs', async () => {
        // Arrange
        const listId = 456;
        const title = 'Another Task';
        const mockResponse = {
            data: {
                id: 2,
                title: 'Another Task',
                completed: false,
            },
        };
        ($api.post as jest.Mock).mockResolvedValue(mockResponse);

        // Act
        const result = await createTask(listId, title);

        // Assert
        expect($api.post).toHaveBeenCalledWith(`/todos/${listId}/tasks`, {
            title,
        });
        expect(result).toEqual(mockResponse);
    });
});
