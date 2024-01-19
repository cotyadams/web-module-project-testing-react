import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Display from './../Display';
import fetchShow from '../../api/fetchShow.js'

jest.mock('../../api/fetchShow')

beforeEach(() => {
    jest.clearAllMocks();
})

test('renders without errors with no props', async () => { 
    render(<Display />)
    const button = screen.getByText(/Press to Get Show Data/i);
    expect(button).toBeInTheDocument();
});

test('renders Show component when the button is clicked ', async () => { 
    fetchShow.mockResolvedValueOnce({
        image: {
            medium: "https://static.tvmaze.com/uploads/images/medium_portrait/61/154035.jpg",
            original: "https://static.tvmaze.com/uploads/images/original_untouched/61/154035.jpg"
        },
        name: "Stranger Things",
        summary: "A love letter to the '80s classics that captivated a generation, Stranger Things is set in 1983 Indiana, where a young boy vanishes into thin air. As friends, family and local police search for answers, they are drawn into an extraordinary mystery involving top-secret government experiments, terrifying supernatural forces and one very strange little girl.",
        seasons: [1, 2, 3, 4, 5]
    })
    render(<Display />)
    const button = screen.getByRole('button')
    fireEvent.click(button);
    const show = await screen.findByTestId('show-container');
    expect(show).toBeInTheDocument();
});

test('renders show season options matching your data when the button is clicked',async () => {
    fetchShow.mockResolvedValueOnce({
        image: {
            medium: "https://static.tvmaze.com/uploads/images/medium_portrait/61/154035.jpg",
            original: "https://static.tvmaze.com/uploads/images/original_untouched/61/154035.jpg"
        },
        name: "Stranger Things",
        summary: "A love letter to the '80s classics that captivated a generation, Stranger Things is set in 1983 Indiana, where a young boy vanishes into thin air. As friends, family and local police search for answers, they are drawn into an extraordinary mystery involving top-secret government experiments, terrifying supernatural forces and one very strange little girl.",
        seasons: [
            { id: 0, name: 'season 1' },
            { id: 1, name: 'season 2' },
            { id: 2, name: 'season 3' },
            { id: 3, name: 'season 4' },
            { id: 4, name: 'season 5' }
        ]
    })
    render(<Display />)
    const button = screen.getByRole('button')
    fireEvent.click(button);
    const seasonOptions = await screen.findAllByTestId('season-option')
    expect(seasonOptions).toHaveLength(5)
    expect(seasonOptions[0]).toHaveAttribute('value')

    const title = await screen.findAllByText(/Stranger Things/i)
    expect(title[0]).toBeInTheDocument();
 });
