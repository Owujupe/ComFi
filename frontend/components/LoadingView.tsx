function LoadingView() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status"
      >
        ...
      </div>
    </div>
  );
}

export default LoadingView;
