interface PokemonCardProps {
  name: string;
  imageUrl?: string;
  number: number;
  types: string[];
}
export default function PokemonCard(props: PokemonCardProps) {
  const { imageUrl, name, number, types } = props;
  return (
    <div className="pokemon-card">
      <div style={{ display: "flex" }}>
        <div style={{ width: "100px" }}>
          <img src={imageUrl} alt={name} className="pokemon-image" />
        </div>
        <div style={{ width: "100px", margin: "10px" }}>
          <div>
            {types.map((type, index) => (
              <span
                style={{ marginBottom: "4px", display: "grid" }}
                key={index}
                className={`pokemon-type ${type}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="pokemon-name">
          {name} &nbsp;&nbsp;&nbsp;#{number}
        </h3>
      </div>
    </div>
  );
}
