import azure.functions as func
from json import dumps
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from openai import OpenAI

vault_url = "https://kv-galwort.vault.azure.net/"
credential = DefaultAzureCredential()
secret_client = SecretClient(vault_url=vault_url, credential=credential)
client = OpenAI(api_key=secret_client.get_secret("OAIKey").value)


def gen_jobs(company_description):
    system_message = (
        "You are a food name summarizer. "
        + "When given a description of a company, "
        + "your job is to reply with a list of job titles "
        + "that the company should hire for. "
        + "Reply in JSON format with the word 'jobs' as the key, "
        + "and the job titles as a list of strings as the value."
    )

    messages = [{"role": "system", "content": system_message}]
    user_message = {"role": "user", "content": company_description}
    messages.append(user_message)

    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=messages,
    )

    jobs = response.choices[0].message.content["jobs"]

    return jobs


def main(req: func.HttpRequest) -> func.HttpResponse:
    req_body = req.get_json()
    company_description = req_body["company_description"]

    jobs = gen_jobs(company_description)

    return func.HttpResponse(dumps({"jobs": jobs}), mimetype="application/json")
