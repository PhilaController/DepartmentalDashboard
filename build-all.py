import os
import shutil
import subprocess
from pathlib import Path

current_folder = Path(__file__).parent.resolve()
report_folder = current_folder / "src" / "views" / "Home"

if __name__ == "__main__":

    # Clean output folder
    final_output_folder = current_folder / "final-builds"
    if not final_output_folder.is_dir():
        final_output_folder.mkdir()

    for f in final_output_folder.glob("*"):
        os.remove(f)

    # Build
    for f in report_folder.glob("*"):
        tag = f.stem
        fy = f"20{tag[2:]}"
        print(f"Building {tag}...")

        # Run
        subprocess.run(["make", "build", f"fy={fy}"])

        # Copy
        output_path = list((current_folder / "dist").glob("*app*.js"))[0]
        shutil.copy(output_path, final_output_folder / output_path.name)
