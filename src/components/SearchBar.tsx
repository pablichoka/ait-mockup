import { useState } from "react";
import { TextField, Button, Paper, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (term: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{ p: 2, display: "flex", alignItems: "center" }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar farmacias por nombre o municipio..."
        value={searchTerm}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mr: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ ml: 1, py: 1.5 }}
      >
        Buscar
      </Button>
    </Paper>
  );
}
