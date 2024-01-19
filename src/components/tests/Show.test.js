import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Show from './../Show'
import Loading from '../Loading';
import fetchShow from '../../api/fetchShow';
import  userEvent from '@testing-library/user-event';

const selectedSeason = 0;
const show = {
    name: 'grey 59',
    summary: 'amazing',
    seasons: [{
            id: 0,
            name: 'ruby',
            episodes: [1, 2]
        },
        {
            id: 1,
            name: 'ghostmane',
            episodes: [1, 2]
        }]
    
}
jest.mock('../../api/fetchShow')

beforeEach(() => {
    fetchShow.mockResolvedValueOnce(show)
})
test('renders without errors', () => {
    render(<Show show={show} selectedSeason={selectedSeason} />)
 });

test('renders Loading component when prop show is null', () => { 
    render(<Show show={null} />)
    const loading = screen.getByText(/Fetching data../i)
    expect(loading).toBeInTheDocument();
});

test('renders same number of options seasons are passed in', async () => { 
    render(<Show show={show} selectedSeason={selectedSeason}/>)
    const seasonSelector = document.querySelector('select')
    userEvent.click(seasonSelector)
    const seasons = await screen.findAllByTestId(/season-option/i)
    expect(seasons).toHaveLength(2)
});

test('handleSelect is called when a season is selected', () => { 
    const handleSelect = jest.fn();
    render(<Show show={show} selectedSeason={'none'} handleSelect={handleSelect} />);
    const select = screen.getByLabelText(/Select A Season/i);
    userEvent.selectOptions(select, ['1']);
    expect(handleSelect).toBeCalled();
});

test('component renders when no seasons are selected and then rerenders with a season passed in', () => { 
    const { rerender } = render(<Show show={show} selectedSeason={'none'} />)
    const component = screen.getByTestId('show-container')
    expect(component).toBeInTheDocument();
    rerender(<Show show={show} selectedSeason={1} />)
    const showName = screen.getByText(show.name)
    expect(showName).toBeInTheDocument();
});
