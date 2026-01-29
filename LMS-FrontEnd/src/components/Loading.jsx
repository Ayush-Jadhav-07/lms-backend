export default function Loading({ text = "Loading..." }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="text-center">
        <div className="spinner-border mb-3" role="status"></div>
        <div className="text-muted">{text}</div>
      </div>
    </div>
  );
}
