// search bar
const SearchBar = ({ searchTerm, onSearch }) => {
    return (
        <div className='w-1/3'>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                className="p-2 px-4 border-none rounded-3xl bg-black/50 w-full focus:outline-none"
                onChange={onSearch}
            />
        </div>
    )
}

export default SearchBar
