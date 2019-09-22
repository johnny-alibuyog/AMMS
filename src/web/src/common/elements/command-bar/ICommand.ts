interface ICommand {
  exec: () => void;
  notify(): void;
}
