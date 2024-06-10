import os
import urllib.parse
from pathlib import Path
from tempfile import TemporaryDirectory
from xml.etree import ElementTree

import requests
from pyaqueduct import API
from pyaqueduct.experiment import Experiment


def solve_with_wolfram_alpha(app_id: str, question: str) -> str:
    question_encoded = urllib.parse.quote_plus(question)
    url = f"http://api.wolframalpha.com/v2/query?input={question_encoded}&appid={app_id}"
    response = requests.get(url)
    tree = ElementTree.fromstring(response.content)

    result = []
    for node in tree.findall("./pod[@id='Solution']/subpod/plaintext"):
        if node.text:
            result.append(node.text)
    for node in tree.findall("./pod[@id='ComplexSolution']/subpod/plaintext"):
        if node.text:
            result.append(node.text)
    return "\n".join(sorted(result))


def save_to_aqueduct(
    content: str, aqueduct_url: str, aqueduct_key: str, eid: str, filename: str
) -> None:
    """Saves content string as a file in aqueduct

    content (str): string to save
    aqueduct_url (str): URL of the aqueduct instance
    aqueduct_key (str): access key (if needed) to access the instance
    eid (str):
        EID of the experiment where the file will be saved
    filename (str):
        name of the resulting file
    """
    api = API(url=aqueduct_url, timeout=10)
    exp = api.get_experiment(eid)

    with TemporaryDirectory() as directory:
        fullname = Path(directory) / filename
        with open(fullname, "w") as file:
            file.write(content)
        exp.upload_file(fullname)


if __name__ == "__main__":

    app_id = os.environ.get("wolfram_app_id", "")
    problem = os.environ.get("equation", "")

    aq_url = os.environ.get("aqueduct_url", "")
    aq_key = os.environ.get("aqueduct_key", "")

    eid = os.environ.get("experiment", "")
    filename = os.environ.get("result_file", "")

    solution = solve_with_wolfram_alpha(app_id, problem)
    save_to_aqueduct(f"{problem}:\n{solution}", aq_url, aq_key, eid, filename)
    print(solution)
